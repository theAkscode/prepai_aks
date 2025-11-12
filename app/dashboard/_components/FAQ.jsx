"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      id: 1,
      question: "How do I create a new mock interview?",
      answer: "Click on the '+ Add New' card above, fill in your job position, tech stack/job description, and years of experience. The AI will generate relevant interview questions based on your input. Click 'Start Interview' to begin."
    },
    {
      id: 2,
      question: "Can I retake a previous interview?",
      answer: "Yes! Simply click on any interview card from your 'Previous Mock Interviews' list and click the 'Start' button. You can practice the same interview multiple times to improve your performance."
    },
    {
      id: 3,
      question: "How does the AI generate interview questions?",
      answer: "Our AI analyzes your job role, tech stack, and experience level to create customized interview questions. The questions are tailored to match real-world interview scenarios for your specific position and skill level."
    },
    {
      id: 4,
      question: "Do I need to enable my webcam and microphone?",
      answer: "Yes, for the best experience, enable your webcam and microphone when prompted. This allows the platform to record your responses and provide more comprehensive feedback. Make sure you're in a quiet environment with good lighting."
    },
    {
      id: 5,
      question: "How can I view my interview feedback?",
      answer: "After completing an interview, click the 'Feedback' button on the interview card. You'll see detailed feedback on your answers, including ratings, suggestions for improvement, and correct answers for comparison."
    },
    {
      id: 6,
      question: "What happens to my interview recordings?",
      answer: "Your responses are processed to provide feedback and improve your interview skills. The platform analyzes your answers to give you constructive feedback and ratings based on accuracy and completeness."
    },
    {
      id: 7,
      question: "Can I customize the number of questions?",
      answer: "The AI automatically generates an appropriate number of questions based on your job role and experience level. This ensures comprehensive coverage of relevant topics without overwhelming you."
    },
    {
      id: 8,
      question: "What should I do if I encounter technical issues?",
      answer: "If you experience issues with the webcam, microphone, or page loading, try refreshing the page. Make sure you've granted the necessary permissions for camera and microphone access in your browser settings."
    }
  ];

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="mt-10 mb-10">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="font-bold text-2xl">Frequently Asked Questions</h2>
      </div>
      
      <div className="space-y-4 max-w-4xl">
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems[faq.id]}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <div className="border rounded-lg bg-white hover:shadow-md transition-shadow">
              <CollapsibleTrigger className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 rounded-lg transition-colors">
                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                {openItems[faq.id] ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-5 pb-5 pt-2">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>

      <div className="mt-8 p-5 bg-blue-50 border border-blue-200 rounded-lg max-w-4xl">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600" />
          Need More Help?
        </h3>
        <p className="text-gray-700">
          If you have questions that aren't covered here, feel free to explore the platform and experiment with different features. 
          The best way to learn is by creating your first mock interview and experiencing the process firsthand!
        </p>
      </div>
    </div>
  );
};

export default FAQ;
