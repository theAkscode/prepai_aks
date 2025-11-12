"use client";

import React from 'react';
import { PlusCircle, Sparkles, Video, MessageSquare, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const HowItWorks = () => {
  const router = useRouter();

  const steps = [
    {
      number: '01',
      icon: PlusCircle,
      title: 'Create Your Mock Interview',
      description: 'Simply click "+ Add New" on your dashboard and fill in your job position, tech stack, and years of experience. It takes less than a minute to get started.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      number: '02',
      icon: Sparkles,
      title: 'AI Generates Custom Questions',
      description: 'Our advanced AI analyzes your profile and generates personalized interview questions tailored to your specific role, experience level, and tech stack.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      number: '03',
      icon: Video,
      title: 'Take Your Interview',
      description: 'Enable your webcam and microphone, then answer each question just like a real interview. Practice your responses, body language, and communication skills in a realistic environment.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      number: '04',
      icon: MessageSquare,
      title: 'Get Instant Feedback',
      description: 'Receive detailed AI-powered feedback on your answers, including ratings, improvement suggestions, and comparison with ideal responses. Track your progress over time.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className='p-10 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='text-center mb-16'>
        <h1 className='font-bold text-4xl mb-4'>How It Works</h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Master your interview skills in 4 simple steps. Our AI-powered platform 
          makes interview preparation easy, effective, and accessible.
        </p>
      </div>

      {/* Steps Section */}
      <div className='space-y-12 mb-20'>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Icon and Number */}
              <div className='flex-shrink-0'>
                <div className={`relative ${step.bgColor} rounded-2xl p-8 shadow-sm`}>
                  <Icon className={`h-16 w-16 ${step.color}`} />
                  <div className='absolute -top-4 -right-4 bg-white border-4 border-background rounded-full w-12 h-12 flex items-center justify-center font-bold text-gray-400'>
                    {step.number}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`flex-1 ${isEven ? 'text-left' : 'md:text-right'}`}>
                <h3 className='font-bold text-2xl mb-3'>{step.title}</h3>
                <p className='text-gray-700 text-lg leading-relaxed'>
                  {step.description}
                </p>
              </div>

              {/* Arrow (hidden on mobile, only between steps) */}
              {index < steps.length - 1 && (
                <div className='hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-32'>
                  <ArrowRight className='h-8 w-8 text-gray-300 rotate-90' />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-12'>
        <h2 className='font-bold text-2xl mb-6 text-center'>Why Choose Our Platform?</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <Sparkles className='h-8 w-8 text-primary mb-3' />
            <h3 className='font-semibold text-lg mb-2'>AI-Powered</h3>
            <p className='text-gray-600 text-sm'>
              Advanced AI technology creates personalized questions and provides intelligent feedback.
            </p>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <Zap className='h-8 w-8 text-primary mb-3' />
            <h3 className='font-semibold text-lg mb-2'>Instant Results</h3>
            <p className='text-gray-600 text-sm'>
              Get immediate feedback and track your improvement across multiple practice sessions.
            </p>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <Video className='h-8 w-8 text-primary mb-3' />
            <h3 className='font-semibold text-lg mb-2'>Realistic Practice</h3>
            <p className='text-gray-600 text-sm'>
              Practice with video recording to improve both your answers and presentation skills.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section - Why Upgrade */}
      <div className='bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 text-center'>
        <h2 className='font-bold text-2xl mb-3'>Ready to Level Up?</h2>
        <p className='text-gray-700 mb-6 max-w-2xl mx-auto'>
          Unlock unlimited mock interviews, advanced AI feedback, performance analytics, 
          and more premium features to accelerate your interview preparation.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <Button 
            size='lg'
            onClick={() => router.push('/dashboard')}
            variant='outline'
          >
            Start Free Trial
          </Button>
          <Button 
            size='lg'
            onClick={() => router.push('/dashboard/upgrade')}
            className='bg-primary hover:bg-primary/90'
          >
            View Upgrade Plans
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </div>
        <p className='text-sm text-gray-500 mt-4'>
          No credit card required for the free plan • Upgrade anytime
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className='mt-12 text-center'>
        <p className='text-gray-600 mb-4'>Need help getting started?</p>
        <Button 
          variant='ghost'
          onClick={() => router.push('/dashboard/questions')}
        >
          View Frequently Asked Questions
        </Button>
      </div>
    </div>
  );
};

export default HowItWorks;
