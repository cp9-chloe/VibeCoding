'use client';

import SettingsPanel from '@/components/SettingsPanel';
import BackButton from '@/components/BackButton';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function SettingsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <AnimatedBackground />
      <BackButton />

      <div className="z-10 relative">
        <SettingsPanel />
      </div>
    </main>
  );
}
