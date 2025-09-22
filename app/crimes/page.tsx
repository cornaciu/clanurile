'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CrimeQuest {
  id: string;
  title: string;
  description: string;
  difficulty?: string;
  rewardMoney: number;
  rewardExp: number;
  time?: number;
}

export default function CrimesPage() {
  const [crimes, setCrimes] = useState<CrimeQuest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchCrimes() {
      try {
        const response = await fetch("/api/quests/crimes"); // Vom crea acest API in curand
        if (!response.ok) {
          throw new Error("Eroare la preluarea crimelor.");
        }
        const data = await response.json();
        setCrimes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCrimes();
  }, []);

  const handleStartCrime = async (questId: string) => {
    const response = await fetch("/api/crimes/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questId }),
    });

    const data = await response.json();
    alert(data.message);
    if (response.ok) {
      router.push('/profile'); // Redirecționează la profil după ce începe misiunea
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        Se încarcă crimele...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center p-8 md:p-12 lg:p-24 bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-8">Alege o Crimă</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl">
        {crimes.map((crime) => (
          <Card key={crime.id} className="bg-gray-800 border-gray-700 text-white hover:border-blue-500 transition-colors">
            <CardHeader>
              <CardTitle>{crime.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {crime.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold">Dificultate:</span>
                <Badge variant="outline" className="w-fit">
                  {crime.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">Recompensă:</span>
                <span className="text-green-400">${crime.rewardMoney}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold">EXP:</span>
                <span>{crime.rewardExp}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <span className="text-sm text-gray-500">Durată: {crime.time} minute</span>
              <Button onClick={() => handleStartCrime(crime.id)}>Fă crima</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button variant="ghost">Înapoi la Panoul de Bord</Button>
        </Link>
      </div>
    </div>
  );
}