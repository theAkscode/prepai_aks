import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAuth } from '@clerk/nextjs/server';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

export async function POST(req) {
  try {
    // Check if Stripe is configured
    if (!stripe || !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_key_here') {
      return NextResponse.json({ 
        error: 'Stripe is not configured. Please add your Stripe keys to .env.local',
        details: 'Check STRIPE_SETUP.md for setup instructions'
      }, { status: 503 });
    }

    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planName, priceId } = body;

    if (!planName) {
      return NextResponse.json({ error: 'Plan name is required' }, { status: 400 });
    }

    // Define price mapping (you'll need to create these in your Stripe Dashboard)
    const priceMapping = {
      'Pro': process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
      'Enterprise': process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_placeholder'
    };

    const stripePriceId = priceId || priceMapping[planName];

    // Check if price ID is still a placeholder
    if (!stripePriceId || stripePriceId.includes('placeholder')) {
      return NextResponse.json({ 
        error: 'Stripe price ID not configured',
        details: `Please create a ${planName} product in Stripe Dashboard and add the price ID to .env.local`
      }, { status: 503 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}&plan=${planName}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/upgrade?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId,
        planName,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
