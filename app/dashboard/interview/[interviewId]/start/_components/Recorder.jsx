"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { chatSession } from '@/utils/GeminiAiModel';
import { useRouter } from 'next/navigation';

const Recorder = ({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState("");
    // this is for loading state when the ai is processing the answer 
    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState('');
    const [lastProcessedAnswer, setLastProcessedAnswer] = useState('');
    const [userStoppedRecording, setUserStoppedRecording] = useState(false);
    const router = useRouter();
    const params = useParams();
    const [aiRawResponse, setAiRawResponse] = useState('');
    
    // Get the current interview ID from URL params
    const currentInterviewId = params?.interviewId;
    
    // Debug logging
    useEffect(() => {
        console.log('Recorder initialized with:');
        console.log('- currentInterviewId from URL:', currentInterviewId);
        console.log('- interviewData:', interviewData);
        console.log('- interviewData.id:', interviewData?.id);
        console.log('- interviewData.mockIdRef:', interviewData?.mockIdRef);
        console.log('- interviewData.mockId:', interviewData?.mockId);
    }, [currentInterviewId, interviewData]);

    const {
        error,
        interimResult,
        isRecording,
        results = [],
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (error) {
            console.error("Speech-to-Text Error:", error);
        }
    }, [error]);

    // Log important debug info to the browser console when key values change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            console.log('Debug snapshot:', {
                isRecording,
                isProcessing,
                interimResult,
                userAnswer,
                lastProcessedAnswer,
                aiRawResponse,
                feedback,
                rating,
            });
        }
    }, [isRecording, isProcessing, interimResult, userAnswer, lastProcessedAnswer, aiRawResponse, feedback, rating]);

    useEffect(() => {
        // results shape can vary depending on the speech lib; handle multiple possible shapes
        const transcript = results.map(r => {
            if (!r) return '';
            if (typeof r === 'string') return r;
            if (r.transcript) return r.transcript;
            if (r?.alternatives && r.alternatives[0]?.transcript) return r.alternatives[0].transcript;
            // fallback to JSON stringify snippet
            try { return JSON.stringify(r).slice(0, 200); } catch { return '' }
        }).filter(Boolean).join(' ');

        // debug interim and results
        console.debug('Speech interimResult:', interimResult, 'speech results array:', results, 'assembled transcript:', transcript);

        setUserAnswer(interimResult ? `${transcript} ${interimResult}`.trim() : transcript);
    }, [interimResult, results]);

    // Only trigger processing when user stops speaking, answer is long enough, and hasn't been processed yet
    useEffect(() => {
        // Only process when the user explicitly stopped recording. This avoids
        // accidental processing if the speech hook temporarily pauses or resets.
        const trimmed = (userAnswer || '').trim();
        if (userStoppedRecording && trimmed.length > 10 && trimmed !== (lastProcessedAnswer || '') && !isProcessing) {
            UpdateUserAnswerInDb();
        }
    }, [userAnswer, userStoppedRecording, lastProcessedAnswer, isProcessing]);

    const SaveUserAnswers = async () => {
        if (isRecording) {
            // Stop recording and let the useEffect watch for isRecording change + userAnswer to trigger processing.
            stopSpeechToText();
            setUserStoppedRecording(true);
            toast('Stopped recording — processing your answer...');
            return;
        }

        // Starting recording: request microphone access first so we can surface a clear error if blocked
        try {
            if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            }
            startSpeechToText();
            // mark that recording is started by the user
            setUserStoppedRecording(false);
            toast('Recording started — speak now');
        } catch (err) {
            console.error('Microphone access error:', err);
            toast.error('Microphone access denied. Please enable microphone permissions in your browser.');
        }
    };
 
    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        }
        else {
            startSpeechToText();
        }
    }

    // navigation handlers
    const goPrevious = () => {
        if (activeQuestionIndex > 0) setActiveQuestionIndex(activeQuestionIndex - 1);
    };
    const goNext = () => {
        if (mockInterviewQuestions && activeQuestionIndex < mockInterviewQuestions.length - 1) {
            setActiveQuestionIndex(activeQuestionIndex + 1);
        }
    };
    const endInterview = () => {
        // navigate back to dashboard or interviews list
        router.push('/dashboard');
    };

    const UpdateUserAnswerInDb = async () => {
        // prevent re-entry
        if (isProcessing) return;
        setIsProcessing(true);
        setFeedback('');
        setRating('');

        try {
            console.log('Processing answer for AI feedback:', { userAnswer, isProcessing });

            const feedbackPrompt = "Question: " + (mockInterviewQuestions?.[activeQuestionIndex]?.question || mockInterviewQuestions?.[activeQuestionIndex]?.text || "") +
                "\nAnswer: " + userAnswer +
                "\nProvide feedback on the above answer in less than 50 words. If possible, return JSON like { \"feedback\": \"...\", \"rating\": 4 } otherwise plain text.";

            console.debug('Sending prompt to AI:', feedbackPrompt);
            
            let result = null;
            try {
                result = await chatSession.sendMessage(feedbackPrompt);
                console.debug('AI raw result object:', result);
            } catch (aiError) {
                console.error('AI API Error:', aiError);
                // Set fallback feedback if AI fails
                setFeedback('AI feedback unavailable - please check your API configuration');
                setRating('N/A');
                
                // Still save the user answer even if AI fails
                const fallbackPayload = {
                    mockIdRef: currentInterviewId || interviewData?.mockIdRef || interviewData?.mockId || '',
                    question: mockInterviewQuestions?.[activeQuestionIndex]?.question || mockInterviewQuestions?.[activeQuestionIndex]?.text || `Question ${activeQuestionIndex + 1}`,
                    correctAns: mockInterviewQuestions?.[activeQuestionIndex]?.correctAns || mockInterviewQuestions?.[activeQuestionIndex]?.correctAnswer || '',
                    userAns: userAnswer,
                    feedback: 'AI feedback unavailable - please check your API configuration',
                    rating: 'N/A',
                    userEmail: interviewData?.createdBy || interviewData?.createdByEmail || ''
                };
                
                try {
                    const saveResponse = await fetch('/api/save-user-answer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(fallbackPayload)
                    });
                    if (saveResponse.ok) {
                        console.log('User answer saved without AI feedback');
                    }
                } catch (saveError) {
                    console.error('Failed to save user answer:', saveError);
                }
                
                setIsProcessing(false);
                return;
            }

            // Extract text from the SDK's response robustly
            let textResp = '';
            try {
                if (result == null) {
                    textResp = '';
                } else if (typeof result?.response?.text === 'function') {
                    textResp = await result.response.text();
                } else if (typeof result?.response === 'string') {
                    textResp = result.response;
                } else if (typeof result?.response?.text === 'string') {
                    textResp = result.response.text;
                } else if (typeof result?.toString === 'function') {
                    textResp = String(result.toString());
                } else {
                    // last-resort stringify
                    textResp = JSON.stringify(result?.response || result || '');
                }
            } catch (e) {
                console.error('Error extracting text from AI result:', e);
                try { textResp = JSON.stringify(result?.response || result || ''); } catch { textResp = String(result || ''); }
            }

            // expose raw response for debugging in UI
            setAiRawResponse(textResp);
            console.debug('AI text response:', textResp);
            // Also print the raw response and SDK result to the console so it's easy to inspect in devtools
            if (typeof window !== 'undefined') {
                console.log('AI raw response (text):', textResp);
                console.log('AI raw result object:', result);
            }

            const cleaned = textResp.replace(/```json/g, '').replace(/```/g, '').trim();

            // Try to parse JSON first
            let parsed = null;
            try {
                parsed = JSON.parse(cleaned);
            } catch (e) {
                parsed = null;
            }

            if (parsed && typeof parsed === 'object') {
                setFeedback(parsed.feedback || parsed.message || JSON.stringify(parsed));
                setRating(parsed.rating ?? parsed.score ?? parsed.rating_score ?? '');
            } else {
                // Try to extract rating with regex (e.g., "rating: 4")
                const ratingMatch = cleaned.match(/rating\s*[:=]\s*(\d+(?:\.\d+)?)/i);
                if (ratingMatch) setRating(ratingMatch[1]);
                setFeedback(cleaned);
            }

            // If AI didn't provide feedback, generate a simple fallback so the user always sees something
            const trimmedAnswer = (userAnswer || '').trim();
            if ((!feedback || feedback.trim() === '') && (!aiRawResponse || aiRawResponse.trim() === '')) {
                // heuristic feedback
                let fallbackRating = 3;
                if (trimmedAnswer.length > 120) fallbackRating = 5;
                else if (trimmedAnswer.length > 80) fallbackRating = 4;
                else if (trimmedAnswer.length > 40) fallbackRating = 3;
                else fallbackRating = 2;
                const fallbackFeedback = `Auto-feedback: Answer length ${trimmedAnswer.length} characters. Try to include specific examples and structure your response (STAR).`;
                setFeedback(fallbackFeedback);
                setRating(String(fallbackRating));
            }

            // Mark as processed so we don't call again for same answer
            setLastProcessedAnswer(trimmedAnswer);

            // Persist the user answer, feedback and rating to the server DB
            let payload = null;
            try {
                payload = {
                    mockIdRef: currentInterviewId || interviewData?.mockIdRef || interviewData?.mockId || '',
                    question: mockInterviewQuestions?.[activeQuestionIndex]?.question || mockInterviewQuestions?.[activeQuestionIndex]?.text || `Question ${activeQuestionIndex + 1}`,
                    correctAns: mockInterviewQuestions?.[activeQuestionIndex]?.correctAns || mockInterviewQuestions?.[activeQuestionIndex]?.correctAnswer || '',
                    userAns: userAnswer,
                    feedback: parsed && parsed.feedback ? parsed.feedback : (cleaned || ''),
                    rating: parsed && (parsed.rating ?? parsed.score) ? String(parsed.rating ?? parsed.score) : (rating ? String(rating) : ''),
                    userEmail: interviewData?.createdBy || interviewData?.createdByEmail || ''
                };

                // show payload in console for debugging
                console.debug('Auto DB payload:', payload);
                if (typeof window !== 'undefined') console.log('Auto DB payload (console):', { payload, isProcessing });

                const res = await fetch('/api/save-user-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    console.error('Failed saving user answer:', await res.text());
                    toast.error('Failed to save the answer to the database.');
                } else {
                    toast.success('Saved answer and feedback to DB.');
                }
            } catch (e) {
                console.error('Error saving user answer to DB:', e);
            }

        } catch (e) {
            console.error("Error getting feedback from AI:", e);
            toast.error("There was an error getting feedback from the AI.");
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex-col mt-20 justify-center items-center p-5 rounded-lg relative'>
                <Image
                    src="/webCam.png"
                    width={400}
                    height={300}
                    className='absolute'
                    alt='webcam image'
                    priority
                />
                <Webcam
                    mirrored="true"
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                    }}
                    onUserMediaError={(err) => {
                        console.log("Webcam Error:", err);
                        // Stop any in-progress speech recognition and show a clear message
                        try { stopSpeechToText(); } catch (e) {}
                        toast.error('Webcam / microphone permission denied. Please enable permissions.');
                    }}
                    onUserMedia={() => {
                        // microphone/camera granted
                        toast('Webcam and microphone access granted.');
                    }}
                />
            </div>
            <Button
                variant="outline"
                className="my-10 z-20"
                onClick={SaveUserAnswers}
                disabled={isProcessing} // Disable button while processing
            >
                {isRecording ? (
                    <span className='text-red-800 flex items-center gap-2'>
                        <Mic /> Stop Recording...
                    </span>
                ) : (
                    isProcessing ? 'Processing...' : 'Record Answer'
                )}
            </Button>
            <div className='mt-5 p-3 border rounded-lg w-full max-w-2xl'>
                <h2 className='text-lg font-bold'>Your Answer:</h2>
                <p className={isRecording ? 'text-blue-700' : ''}>{userAnswer || (isRecording ? 'Listening...' : "Your transcribed answer will appear here...")}</p>
                {isRecording && (
                    <div className='mt-2 flex items-center gap-2 text-sm text-red-600'>
                        <span className='h-3 w-3 rounded-full bg-red-600 animate-pulse inline-block' />
                        <span>Recording...</span>
                    </div>
                )}
                {/* Debug panel to show live speech hook data (visible during development) */}
                {/* Debug info is logged to the browser console; removed from UI per design. */}
            </div>

            {/* Navigation controls */}
            <div className='mt-5 p-3 border rounded-lg w-full max-w-2xl'>
                <div className='flex items-center gap-3 justify-between'>
                    <div className='flex gap-3'>
                        <button 
                            onClick={goNext} 
                            className='px-4 py-2 border rounded hover:bg-gray-50 transition-colors'
                            disabled={mockInterviewQuestions && activeQuestionIndex === mockInterviewQuestions.length - 1}
                        >
                            Next
                        </button>
                    </div>
                    <button 
                        onClick={() => {
                            // Process any remaining unprocessed answer
                            if (userAnswer && userAnswer !== lastProcessedAnswer && !isProcessing) {
                                UpdateUserAnswerInDb().then(() => {
                                    toast.success('Interview completed! Redirecting to feedback...');
                                    router.push(`/dashboard/interview/${currentInterviewId}/feedback`);
                                });
                            } else {
                                toast.success('Interview completed! Redirecting to feedback...');
                                router.push(`/dashboard/interview/${currentInterviewId}/feedback`);
                            }
                        }} 
                        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                    >
                        End Interview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Recorder;
