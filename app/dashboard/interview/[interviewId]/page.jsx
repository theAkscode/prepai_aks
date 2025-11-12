"use client";

import React, { useState, useEffect } from 'react';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Webcam from 'react-webcam';
import Link from 'next/link';

const Interview = ({ params }) => {
    const [interviewData, setInterviewData] = useState(null);
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    const GetInterviewDetails = async () => {
        try {
            const resolvedParams = await params;
            const res = await fetch(`/api/get-interview/${encodeURIComponent(resolvedParams.interviewId)}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch interview: ${res.status}`);
            }
            const data = await res.json();
            setInterviewData(data);
        } catch (error) {
            console.error("Error fetching interview details:", error);
            setInterviewData(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            const resolvedParams = await params;
            if (resolvedParams.interviewId) {
                await GetInterviewDetails();
            }
        };
        fetchData();
    }, [params]);

    const handleEnableWebcam = () => {
        setWebcamEnabled(true);
    };

    if (loading) {
        return <div className="text-center mt-10">Loading interview details...</div>;
    }

    if (!interviewData) {
        return <div className="text-center mt-10">No interview data found.</div>;
    }

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-8'>
                {/* Interview Details and Information on the Left */}
                <div className='flex flex-col gap-5'>
                    <div className='p-5 border rounded-lg bg-secondary'>
                        <h2 className='text-lg'><strong>Job Position / Job Role: </strong>{interviewData.jobPosition}</h2>
                        <h2 className='text-lg mt-2'><strong>Job Description / Tech Stack: </strong>{interviewData.jobDesc}</h2>
                        <h2 className='text-lg mt-2'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-amber-400 bg-amber-200'>
                        <h2 className='flex gap-2 items-center text-yellow-600'><Lightbulb /> <strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>
                            {process.env.NEXT_PUBLIC_INFORMATION || 'For the best experience, please keep your camera and microphone enabled. Ensure you are in a quiet place. Good luck!'}
                        </h2>
                    </div>
                </div>

                {/* Webcam Icon/Component on the Right */}
                <div className='flex flex-col gap-5 items-center justify-center'>
                    {webcamEnabled ? (
                        <Webcam 
                            onUserMedia={() => setWebcamEnabled(true)}
                            onUserMediaError={() => setWebcamEnabled(false)}
                            mirrored={true}
                            style={{ height: 300, width: '100%' }}
                            className="rounded-lg border shadow-sm"
                        />
                    ) : (
                        <div className='flex flex-col items-center justify-center p-10 bg-secondary rounded-lg border my-7' style={{ height: 300, width: '100%' }}>
                            <WebcamIcon size={100} className='p-2 bg-secondary rounded-lg border' />
                            <Button variant="ghost" onClick={handleEnableWebcam} className='mt-4'>
                                Enable Web-Camera and Microphone!
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            {/* Start Interview button below the grid, aligned to the right */}
            <div className='flex justify-end mt-4'>
                <Link href={`/dashboard/interview/${interviewData.mockId}/start`}>
                    <Button>Start Interview</Button>
                </Link>
            </div>
        </div>
    );
};

export default Interview; 