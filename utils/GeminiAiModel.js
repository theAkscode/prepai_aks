// Unified Gemini client for browser usage (Next.js client components)
// - Uses direct REST calls to Gemini v1 to avoid SDK surface mismatches
// - Exposes a `chatSession.sendMessage(text)` API compatible with existing code
// - Reads API key from NEXT_PUBLIC_GEMINI_API_KEY (client-safe demo)

// Candidate models to try in order. You can override via NEXT_PUBLIC_GEMINI_MODEL
// If no override, we'll auto-discover via listModels
const MODEL_CANDIDATES = [
    process.env.NEXT_PUBLIC_GEMINI_MODEL,
    // newer aliases first
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    // common stable names
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    // older suffixed variants some keys still expose
    "gemini-1.5-flash-001",
    "gemini-1.0-pro-vision-latest",
    "gemini-1.5-pro-001",
    // legacy fallback
    "gemini-1.0-pro",
    "gemini-1.0-pro-001",
].filter(Boolean);

// Cache for discovered models
let _discoveredModels = null;

async function listAvailableModels() {
    if (_discoveredModels) return _discoveredModels;
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey || "")}`;
        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            _discoveredModels = (data.models || [])
                .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
                .map(m => m.name.replace(/^models\//, ""));
            return _discoveredModels;
        }
    } catch (err) {
        console.warn("Failed to list models:", err);
    }
    return [];
}

// Try both API versions (some accounts only have v1beta). Prefer v1beta first.
const API_VERSIONS = ["v1beta", "v1"];

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    // Surface a clear error early; your UI catches and shows this
    // Note: In production, avoid exposing secrets on the client.
    console.error("Gemini API key is missing. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
}

// Using REST; no SDK client instance required

// Generation config roughly aligned with your previous values
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
};

// safety settings are optional in v1 and enums differ from v1beta; omit to avoid import issues
// No explicit safety settings via REST for now; rely on service defaults
const safetySettings = undefined;

// Helper: normalize text from Responses API
function extractText(respJson) {
    // v1 JSON shape
    const parts = respJson?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) return parts.map((p) => p?.text ?? "").join("");
    if (typeof respJson?.output_text === "string") return respJson.output_text;
    return "";
}

async function generateWithModel(modelId, prompt) {
    const body = {
        contents: [
            { role: "user", parts: [{ text: prompt }] },
        ],
        generationConfig,
    };

    let lastErr;
    for (const version of API_VERSIONS) {
        const url = `https://generativelanguage.googleapis.com/${version}/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey || "")}`;
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (res.ok) {
            return res.json();
        }
        const errText = await res.text().catch(() => res.statusText);
        lastErr = new Error(`HTTP ${res.status} (${version}): ${errText}`);
        lastErr.status = res.status;
        // For model not found (404) or transient/unavailable conditions, try the next API version
        if (
            res.status === 404 ||
            res.status === 503 || // UNAVAILABLE / overloaded
            res.status === 500 ||
            res.status === 502 ||
            res.status === 504 ||
            res.status === 408
        ) {
            continue; // try next version
        }
        throw lastErr; // non-404
    }
    throw lastErr;
}

// Provide a minimal chat-like wrapper compatible with existing code
export const chatSession = {
    async sendMessage(prompt) {
        const input = typeof prompt === "string" ? prompt : String(prompt);
        const errors = [];
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

                // Try discovered models first (prefer cheaper 'flash'), then append static candidates as fallback
                const discovered = await listAvailableModels();
                const sortedDiscovered = [...discovered].sort((a, b) => {
                    const ra = /flash/i.test(a) ? 0 : 1;
                    const rb = /flash/i.test(b) ? 0 : 1;
                    if (ra !== rb) return ra - rb;
                    return a.localeCompare(b);
                });
                // Merge discovered with static candidates, keeping order and uniqueness
                const modelsToTry = [
                    ...sortedDiscovered,
                    ...MODEL_CANDIDATES.filter((m) => !sortedDiscovered.includes(m)),
                ];

        for (const modelId of modelsToTry) {
            let attempt = 0;
            const maxAttempts = 2; // limited retries per model for transient errors
            while (attempt < maxAttempts) {
                try {
                    const json = await generateWithModel(modelId, input);
                    const text = extractText(json);
                    return { response: { text: () => text } };
                } catch (err) {
                    const msg = String(err?.message || err);
                    const status = err?.status;
                    errors.push(`${modelId} (attempt ${attempt + 1}): ${msg}`);
                    const isTransient = (
                        status === 404 ||
                        status === 429 ||
                        status === 503 ||
                        status === 500 ||
                        status === 502 ||
                        status === 504 ||
                        status === 408 ||
                        /404|not found|unsupported|RESOURCE_EXHAUSTED|quota|UNAVAILABLE|overload|overloaded|try again later/i.test(msg)
                    );
                    if (isTransient) {
                        // Backoff for rate limit/overload then either retry or move to next model
                        if (status === 429 || status === 503) {
                            const base = 300;
                            const delay = base * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
                            await sleep(delay);
                        }
                        attempt += 1;
                        if (attempt < maxAttempts) {
                            continue; // retry same model
                        }
                        break; // give up this model, try next
                    }
                    // Non-transient: fail fast
                    throw err;
                }
            }
        }

        throw new Error(
            `All Gemini models failed. Tried: ${modelsToTry.join(", ")}.\n` +
            errors.join("\n")
        );
    },
};