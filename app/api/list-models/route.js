import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        const models = await genAI.listModels();
        console.log('Available models:');
        models.forEach(model => {
            console.log(`- ${model.name} (supports: ${model.supportedGenerationMethods?.join(', ')})`);
        });
        return models;
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

export default async function handler(req, res) {
    const models = await listModels();
    res.status(200).json({ models });
}