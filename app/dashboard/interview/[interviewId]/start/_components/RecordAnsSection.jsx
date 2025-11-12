"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Recorder component to ensure it's only loaded on the client-side.
const Recorder = dynamic(() => import('./Recorder'), { ssr: false });

const RecordAnsSection = ({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex, interviewData }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server to avoid the error.
    }

    const speechSupported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

    return speechSupported ? <Recorder mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} setActiveQuestionIndex={setActiveQuestionIndex} interviewData={interviewData} /> : (
        <div className='mt-5 p-3 border rounded-lg'>
            <h2 className='text-lg font-bold text-red-800'>Speech recognition is not supported in this browser.</h2>
        </div>
    );
};

export default RecordAnsSection;