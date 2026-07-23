'use client';

import { useEffect } from 'react';
import axios from 'axios';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        const res = await axios.get('/api/settings');
        if (res.data.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Default to light mode if fetch fails
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
  }, []);

  return <>{children}</>;
}
