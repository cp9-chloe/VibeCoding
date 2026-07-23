import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI chatbot
const SYSTEM_PROMPT = `You are a friendly blog writing assistant. Help users with:
- Generating blog post ideas
- Writing tips and suggestions
- Improving their writing
- Answering questions about blogging
Keep responses concise and helpful. Use a warm, encouraging tone.`;

// Send a message to the AI and get a response
export async function getAIResponse(userMessage: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0].message.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'Sorry, there was an error with the AI. Please try again.';
  }
}
