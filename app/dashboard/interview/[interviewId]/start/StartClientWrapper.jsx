"use client";

import React, { useState } from 'react';
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';

export default function StartClientWrapper({ mockInterviewQuestions, interviewData }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      <QuestionSection
        mockInterviewQuestions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
      />

      <RecordAnsSection
        mockInterviewQuestions={mockInterviewQuestions}
        activeQuestionIndex={activeQuestionIndex}
        setActiveQuestionIndex={setActiveQuestionIndex}
        interviewData={interviewData}
      />
    </div>
  );
}
