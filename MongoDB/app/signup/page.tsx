import AuthForm from '@/components/AuthForm';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <AnimatedBackground />
      <AuthForm mode="signup" />
    </main>
  );
}
