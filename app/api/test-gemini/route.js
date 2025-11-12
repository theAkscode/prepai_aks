import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key not found',
        message: 'GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY environment variable is missing'
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names to see which ones work
    const modelNames = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest'
    ];
    
    const results = {};
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, just testing if this model works");
        results[modelName] = 'WORKS';
      } catch (error) {
        results[modelName] = error.message;
      }
    }
    
    return NextResponse.json({ 
      success: true,
      apiKeyPresent: true,
      modelTests: results
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed',
      message: error.message 
    }, { status: 500 });
  }
}