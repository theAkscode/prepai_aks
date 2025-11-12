import React from 'react';
import FAQ from '../_components/FAQ';

const QuestionsPage = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-2'>Questions</h2>
      <p className='text-gray-600 mb-8'>Find answers to frequently asked questions about using our AI Mock Interview platform</p>
      
      <FAQ />
    </div>
  );
};

export default QuestionsPage;
