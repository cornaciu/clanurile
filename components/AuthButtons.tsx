// components/AuthButtons.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from 'lucide-react'; // Importa iconițele

export function AuthButtons() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error("Eroare la delogare:", error);
    }
  };
  
  return (
    <div className="flex space-x-4">
      <Button variant="ghost" onClick={() => router.push('/settings')}>
        <Settings className="mr-2 h-4 w-4" /> Setări
      </Button>
      <Button onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Delogare
      </Button>
    </div>
  );
}