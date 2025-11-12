"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Clock, Briefcase } from 'lucide-react';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.primaryEmailAddress?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/list-user-interviews?email=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch interviews: ${res.status}`);
        }
        const data = await res.json();
        setInterviews(data.interviews || []);
      } catch (error) {
        console.error("Error fetching user interviews:", error);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [user]);

  const handleInterviewClick = (mockId) => {
    router.push(`/dashboard/interview/${mockId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-xl mb-4">Previous Mock Interviews</h2>
        <div className="text-gray-500">Loading your interviews...</div>
      </div>
    );
  }

  if (!interviews || interviews.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="font-bold text-xl mb-4">Previous Mock Interviews</h2>
        <div className="text-gray-500">No previous interviews found. Create your first one above!</div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl mb-4">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {interviews.map((interview) => (
          <div
            key={interview.mockId}
            className="border rounded-lg p-5 hover:scale-105 hover:shadow-md cursor-pointer transition-all bg-white"
            onClick={() => handleInterviewClick(interview.mockId)}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Briefcase className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <h2 className="font-bold text-lg text-primary line-clamp-2">
                  {interview.jobPosition}
                </h2>
              </div>
              
              <div className="text-sm text-gray-600 line-clamp-2">
                <strong>Tech Stack:</strong> {interview.jobDesc}
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Experience:</strong> {interview.jobExperience} {interview.jobExperience === '1' ? 'year' : 'years'}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <Clock className="h-4 w-4" />
                <span>Created on {formatDate(interview.createdAt)}</span>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/interview/${interview.mockId}/start`);
                  }}
                >
                  Start
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/dashboard/interview/${interview.mockId}/feedback`);
                  }}
                >
                  Feedback
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;
