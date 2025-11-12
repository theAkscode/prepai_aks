"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
// DB operations are now handled server-side via API route
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'; // Correct import for useRouter

const AddNewInterview = () => {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDesc] = useState('');
  const [jobExperience, setYearsOfExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter(); // Initialize the router

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Generate a set of interview questions and answers in JSON format. Provide the output as a single JSON object with a key 'questions' which is an array of question objects. Each question object must have an 'id', 'question', and 'answer' field. For example: { "questions": [{ "id": 1, "question": "...", "answer": "..." }] }.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const mockJsonResponseText = result.response.text();
      const cleanedResponse = mockJsonResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

      const jsonResponse = JSON.parse(cleanedResponse);

      if (jsonResponse) {
        const apiResp = await fetch('/api/create-mock-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonMockResponse: jsonResponse,
            jobPosition,
            jobDesc: jobDescription,
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
          }),
        });
        if (!apiResp.ok) {
          const errText = await apiResp.text().catch(() => '');
          throw new Error(`Failed to save interview: ${apiResp.status} ${errText}`);
        }
        const { mockId } = await apiResp.json();

        // Navigate only if the insertion was successful
        router.push('/dashboard/interview/' + mockId);
      } else {
        console.error("ERROR: The AI response was empty or invalid.");
      }
    } catch (error) {
      console.error("Error generating or saving interview data:", error);
    } finally {
      setLoading(false);
      setOpenDailog(false);
    }
  };

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDailog(true)}>
        <h2 className='font-bold text-lg'>+ Add New</h2>
      </div>
      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>
              Tell us more about your Role you are Interviewing:
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className='mt-7 my-2'>
              <label>Job Role/ Job Position</label>
              <Input placeholder='Eg: Full Stack Developer' required value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} />
            </div>
            <div className='my-3'>
              <label>Job Description / Tech Stack (In Short)</label>
              <Textarea placeholder='React, Node.js, MySQL' required value={jobDescription} onChange={(e) => setJobDesc(e.target.value)} />
            </div>
            <div className='my-3'>
              <label>Years of Experience</label>
              <Input placeholder='Ex. 6' type='number' max="50" required value={jobExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
            </div>
            <div className='flex gap-5 justify-end mt-4'>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className='animate-spin mr-2' /> Generating from AI
                  </>
                ) : 'Start Interview'}
              </Button>
              <Button type="button" variant='ghost' onClick={() => setOpenDailog(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;