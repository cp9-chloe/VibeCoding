'use client';

import { useEffect, useState } from 'react';
import Bubble from './Bubble';

export default function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number; duration: number }[]>([]);

  // Create new bubbles periodically
  useEffect(() => {
    const createBubble = () => {
      const newBubble = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100, // Random position from 0-100%
        size: Math.random() * 40 + 20, // Random size between 20-60px
        duration: Math.random() * 8 + 6, // Random duration between 6-14 seconds
      };

      setBubbles((prev) => [...prev.slice(-15), newBubble]); // Keep max 15 bubbles
    };

    // Create initial bubbles
    for (let i = 0; i < 8; i++) {
      setTimeout(createBubble, i * 500);
    }

    // Create new bubbles every 1.5 seconds
    const interval = setInterval(createBubble, 1500);

    return () => clearInterval(interval);
  }, []);

  // Remove bubble when it's done animating
  const removeBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden animated-gradient">
      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          id={bubble.id}
          left={bubble.left}
          size={bubble.size}
          duration={bubble.duration}
          onPop={removeBubble}
        />
      ))}

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
    </div>
  );
}
