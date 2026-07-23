import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/lib/openai';

// POST /api/ai/chat - Send message to AI chatbot
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Validate message
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get AI response
    const response = await getAIResponse(message);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
