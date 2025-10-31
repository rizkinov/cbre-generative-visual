"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GenerativePatternsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root - the app now lives at /
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-calibre">Redirecting to Generative Patterns...</p>
    </div>
  );
}
