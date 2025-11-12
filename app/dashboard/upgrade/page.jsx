"use client";

import React, { useState } from 'react';
import { Check, Crown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const UpgradePage = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 mock interviews per month',
        'Basic AI-generated questions',
        'Standard feedback on answers',
        'Access to common interview questions',
        'Email support'
      ],
      highlighted: false,
      buttonText: 'Current Plan',
      buttonVariant: 'outline'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'Most popular for serious learners',
      features: [
        'Unlimited mock interviews',
        'Advanced AI-generated questions',
        'Detailed feedback with improvement tips',
        'Custom interview scenarios',
        'Video recording & playback',
        'Performance analytics & tracking',
        'Priority email support',
        'Export interview reports'
      ],
      highlighted: true,
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'default'
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: '/month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team dashboard & analytics',
        'Up to 10 team members',
        'Custom branding options',
        'API access for integrations',
        'Dedicated account manager',
        'Advanced security features',
        '24/7 priority support',
        'Custom training modules'
      ],
      highlighted: false,
      buttonText: 'Contact Sales',
      buttonVariant: 'outline'
    }
  ];

  const handleUpgrade = async (planName) => {
    if (planName === 'Free') {
      toast.info('You are currently on the Free plan');
      return;
    }

    if (planName === 'Enterprise') {
      toast.info('Please contact our sales team for Enterprise plan');
      return;
    }

    try {
      setLoading(true);
      setSelectedPlan(planName);

      // Create Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planName }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.details || data.error || 'Failed to create checkout session';
        
        if (response.status === 503) {
          toast.error(
            'Stripe is not configured yet. Please set up your Stripe account and add the API keys.',
            { duration: 5000 }
          );
          console.error('Stripe setup required:', errorMsg);
        } else {
          toast.error(errorMsg);
        }
        
        setLoading(false);
        setSelectedPlan(null);
        return;
      }

      const { url } = data;

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to process upgrade. Please try again.');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className='p-10'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <h1 className='font-bold text-4xl mb-3'>Upgrade Your Plan</h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Choose the perfect plan for your interview preparation journey. 
          Upgrade anytime to unlock more features and accelerate your success.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.highlighted
                ? 'border-primary scale-105 shadow-lg'
                : 'border-gray-200'
            }`}
          >
            {/* Popular Badge */}
            {plan.highlighted && (
              <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
                <div className='bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                  <Crown className='h-4 w-4' />
                  Most Popular
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className='text-center mb-6'>
              <h3 className='font-bold text-2xl mb-2'>{plan.name}</h3>
              <p className='text-gray-600 text-sm mb-4'>{plan.description}</p>
              <div className='flex items-baseline justify-center'>
                <span className='text-5xl font-bold'>{plan.price}</span>
                <span className='text-gray-600 ml-1'>{plan.period}</span>
              </div>
            </div>

            {/* Features List */}
            <ul className='space-y-3 mb-8'>
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className='flex items-start gap-3'>
                  <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    plan.highlighted ? 'text-primary' : 'text-green-500'
                  }`} />
                  <span className='text-gray-700 text-sm'>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Upgrade Button */}
            <Button
              variant={plan.buttonVariant}
              className={`w-full ${
                plan.highlighted
                  ? 'bg-primary hover:bg-primary/90'
                  : ''
              }`}
              size='lg'
              onClick={() => handleUpgrade(plan.name)}
              disabled={loading}
            >
              {loading && selectedPlan === plan.name ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                plan.buttonText
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className='mt-16 text-center max-w-3xl mx-auto'>
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h3 className='font-semibold text-lg mb-2'>Need a custom plan?</h3>
          <p className='text-gray-700 mb-4'>
            Looking for a tailored solution for your organization? Contact our sales team 
            to discuss custom pricing and features that match your specific needs.
          </p>
          <Button variant='outline' className='mt-2'>
            Contact Sales Team
          </Button>
        </div>

        <div className='mt-8 text-sm text-gray-600'>
          <p>All plans include secure payment processing. Cancel anytime, no questions asked.</p>
          <p className='mt-2'>🔒 Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
