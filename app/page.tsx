'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth-status');
        const data = await response.json();
        if (data.isAuthenticated) {
          // Redirecționează utilizatorul la pagina sa de profil
          router.push(`/profile/${data.user.username}`);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Eroare la verificarea autentificării:", error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        Se încarcă...
      </div>
    );
  }

  return null;
}