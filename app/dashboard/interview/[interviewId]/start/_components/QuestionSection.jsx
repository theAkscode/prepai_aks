import { Lightbulb } from 'lucide-react';
import React, { useEffect } from 'react';

const QuestionSection = ({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) => {
  // Support either an array or an object; normalize to array
  const questionList = Array.isArray(mockInterviewQuestions)
    ? mockInterviewQuestions
    : mockInterviewQuestions
      ? Object.values(mockInterviewQuestions)
      : [];

  useEffect(() => {
    console.log('QuestionSection: questionList=', questionList);
    console.log('QuestionSection: raw prop mockInterviewQuestions=', mockInterviewQuestions);
  }, [mockInterviewQuestions]);

  // Always render the pills area so user sees Question 1 etc.
  return (
    <div className='p-5 border rounded-lg min-h-[300px]'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {questionList.length > 0 ? (
          questionList.map((question, index) => (
            <h2
              className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activeQuestionIndex === index ? 'bg-primary text-white' : ''
              }`}
              key={index}
              onClick={() => setActiveQuestionIndex(index)}
            >
              Question #{index + 1}
            </h2>
          ))
        ) : (
          <h2 className='p-2 bg-secondary rounded-full text-xs md:text-sm text-center'>Question 1</h2>
        )}
      </div>

      <h2 className='my-5 text-md md:text-lg'>
        {questionList[activeQuestionIndex]?.question || questionList[activeQuestionIndex]?.text || 'No question available'}
      </h2>

      <div className='p-5 bg-blue-100 rounded-lg mt-10'>
        <h2 className='flex gap-2 items-center text-blue-700'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <p className='text-sm text-blue-700 my-2'>{process.env.NEXT_PUBLIC_INFORMATION}</p>
      </div>
    </div>
  );
};

export default QuestionSection;