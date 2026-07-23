'use client';

import { useState } from 'react';

// Props that Bubble accepts
interface BubbleProps {
  id: number;
  left: number;
  size: number;
  duration: number;
  onPop: (id: number) => void;
}

export default function Bubble({ id, left, size, duration, onPop }: BubbleProps) {
  const [popping, setPopping] = useState(false);

  // Handle bubble click - pop animation
  const handlePop = () => {
    setPopping(true);
    // Remove bubble after pop animation completes
    setTimeout(() => {
      onPop(id);
    }, 400); // 400ms for pop animation
  };

  return (
    <div
      onClick={handlePop}
      className={`absolute rounded-full cursor-pointer transition-all ${
        popping ? 'bubble-pop' : 'bubble-float'
      }`}
      style={{
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        bottom: `-${size}px`,
        animationDuration: `${duration}s`,
        background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(200, 180, 255, 0.3))`,
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(200, 180, 255, 0.3)',
      }}
    />
  );
}
