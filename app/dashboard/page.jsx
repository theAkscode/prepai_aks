"use client";

import { UserButton } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

const Dashboard = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const planName = searchParams.get('plan');

    if (sessionId && planName) {
      // Verify the session with Stripe
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
          const data = await response.json();

          if (data.status === 'paid') {
            // Store subscription status in localStorage
            const subscriptionData = {
              plan: planName,
              status: 'active',
              subscribedAt: new Date().toISOString(),
            };
            localStorage.setItem('subscription', JSON.stringify(subscriptionData));
            
            toast.success(`Successfully upgraded to ${planName} plan! 🎉`);
            
            // Clean up URL
            window.history.replaceState({}, '', '/dashboard');
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error('Failed to verify payment. Please contact support.');
        }
      };

      verifyPayment();
    }
  }, [searchParams]);

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'> DashBoard </h2>
      <h2 className='text-gray-900'> Create and Start your AI Mockup Interview </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'> 
        <AddNewInterview />
      </div>

      <InterviewList />
    </div>
  )
}

export default Dashboard