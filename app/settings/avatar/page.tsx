'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const avatars = [
  "/avatars/default.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

export default function AvatarSelectionPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      alert("Te rog selecteaza un avatar!");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/set-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatarUrl: selectedAvatar }),
      });
      
      const data = await response.json();
      alert(data.message);
      
      if (response.ok) {
        router.push('/profile');
      }
    } catch (error) {
      console.error("Eroare la salvarea avatarului:", error);
      alert("Eroare la salvarea avatarului.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-8 md:p-12 lg:p-24 bg-gray-950 text-white">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Alege-ți Avatarul</CardTitle>
          <CardDescription className="text-gray-400">
            Selectează unul dintre avatarele prestabilite pentru a-ți personaliza profilul.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
            {avatars.map((url) => (
              <div
                key={url}
                onClick={() => setSelectedAvatar(url)}
                className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 transform hover:scale-105 border-4 ${selectedAvatar === url ? 'border-blue-500' : 'border-transparent'}`}
              >
                <Image
                  src={url}
                  alt="Avatar"
                  width={96}
                  height={96}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardContent className="flex justify-center mt-4">
          <Button onClick={handleSaveAvatar} disabled={!selectedAvatar || isLoading}>
            {isLoading ? "Se salvează..." : "Salvează Avatarul"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}