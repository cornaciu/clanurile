// app/auth-checker.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthChecker() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();

        if (!data.isAuthenticated) {
          router.push('/login');
        }
      } catch (error) {
        console.error("Eroare la verificarea autentificării:", error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuthStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        Se încarcă...
      </div>
    );
  }

  return null;
}