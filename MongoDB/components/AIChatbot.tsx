'use client';

import { useState } from 'react';
import axios from 'axios';

// Props that AIChatbot accepts
interface AIChatbotProps {
  onInsertText?: (text: string) => void; // Optional: insert AI response into post content
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbot({ onInsertText }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Send message to AI
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { message: userMessage });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all z-50 flex items-center justify-center text-2xl"
        title="AI Writing Assistant"
      >
        🤖
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between">
            <span className="font-bold" style={{ fontFamily: 'Montserrat' }}>
              AI Writing Assistant
            </span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center" style={{ fontFamily: 'Montserrat' }}>
                Ask me for blog post ideas or writing tips!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[85%] ${
                  msg.role === 'user'
                    ? 'bg-purple-100 text-purple-800 ml-auto'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm" style={{ fontFamily: 'Montserrat' }}>
                  {msg.content}
                </p>
                {msg.role === 'assistant' && onInsertText && (
                  <button
                    onClick={() => onInsertText(msg.content)}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
                    style={{ fontFamily: 'Montserrat' }}
                  >
                    Insert into post
                  </button>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 p-3 rounded-xl max-w-[85%]">
                <p className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat' }}>
                  Thinking...
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ fontFamily: 'Montserrat' }}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-3 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'Montserrat' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
