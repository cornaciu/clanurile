'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ProgressBars } from '@/components/ProgressBars';
import { Footer1 } from '@/components/Footer1';
import { MainMenu } from '@/components/navigation/MainMenu';
import { QuestTimer } from '@/components/QuestTimer'; // <<-- Noul import

// Interfata pentru obiectul din inventar
interface Item {
  name: string;
}
// Interfata pentru misiuni
interface Quest {
  id: string;
  title: string;
  description: string;
  rewardMoney: number;
  rewardExp: number;
  difficulty: string;
  time?: number;
  minLevel: number;
}

// Interfata pentru un rând din tabelul de misiuni al utilizatorului
interface UserQuest {
  id: string;
  completed: boolean;
  claimed: boolean;
  quest: Quest;
  startedAt?: string;
}

// Interfață pentru un rând din tabelul de inventar al utilizatorului
interface UserItem {
  quantity: number;
  level: number;
  item: Item;
}

// Interfață pentru utilizator
interface User {
  id: string;
  username: string;
  level: number;
  money: number;
  health: number;
  experience: number;
  rank: string;
  avatarUrl: string;
  inventory: UserItem[];
  quests: UserQuest[];
}

// Interfață pentru clasament
interface PlayerRank {
  rank: number;
  username: string;
  level: number;
  money: number;
}

// Interfață pentru misiuni disponibile (fără statusul utilizatorului)
interface AvailableQuest {
  id: string;
  title: string;
  description: string;
  rewardMoney: number;
  rewardExp: number;
  difficulty: string;
  time?: number;
  minLevel: number;
}
const expToNextLevel = 1000;
const RomaniaMap = dynamic(() => import('@/components/RomaniaMap'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState<PlayerRank[]>([]);
  const [availableQuests, setAvailableQuests] = useState<AvailableQuest[]>([]);
    const [clanInfluence, setClanInfluence] = useState({
    'Timiș': 'red',
    'București': 'blue',
  });

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me');
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }
      const userData = await res.json();
      setUser(userData);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Eroare la preluarea datelor utilizatorului. Te rog autentifică-te din nou.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      } else {
        console.error("Failed to fetch leaderboard");
      }
    } catch (error) {
      console.error("Eroare la preluarea clasamentului:", error);
    }
  };

  const fetchAvailableQuests = async () => {
    try {
      const res = await fetch('/api/quests/available');
      if (res.ok) {
        const data = await res.json();
        const userQuestIds = new Set(user?.quests.map(q => q.quest.id));
        const filteredQuests = data.filter((q: AvailableQuest) => !userQuestIds.has(q.id));
        setAvailableQuests(filteredQuests);
      } else {
        console.error("Failed to fetch available quests");
      }
    } catch (error) {
      console.error("Eroare la preluarea misiunilor disponibile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLeaderboard();
    fetchAvailableQuests();
  }, [router, user]);

  const handleAcceptQuest = async (questId: string) => {
    if (!user) {
      alert("Trebuie să fii autentificat pentru a accepta o misiune.");
      return;
    }
    try {
      const res = await fetch('/api/quests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });
      if (res.ok) {
        alert("Misiune acceptată cu succes!");
        fetchUser();
        fetchAvailableQuests();
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Eroare la acceptarea misiunii:", error);
      alert("Eroare la acceptarea misiunii.");
    }
  };

  const handleClaimReward = async (userQuestId: string) => {
    try {
      const res = await fetch('/api/quests/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuestId }),
      });

      if (res.ok) {
        alert("Recompensă revendicată cu succes!");
        fetchUser();
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Eroare la revendicarea recompensei:", error);
      alert("Eroare la revendicarea recompensei.");
    }
  };

  const handleBattle = (enemyUsername: string) => {
    alert(`Te lupți cu ${enemyUsername}!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        Se încarcă...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return notFound();
  }
  
  // NOU: Funcția de gestionare a expirării timer-ului
  const handleTimerEnd = (userQuestId: string) => {
      setUser(prevUser => {
          if (!prevUser) return null;
          const updatedQuests = prevUser.quests.map(quest => 
              quest.id === userQuestId ? { ...quest, completed: true } : quest
          );
          return { ...prevUser, quests: updatedQuests };
      });
      fetchUser(); // Sincronizează cu server-ul pentru a fi sigur
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-4 space-y-8">
      <MainMenu />

      {/* Secțiunea pentru profilul utilizatorului */}
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 text-white">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Image
            src={user.avatarUrl}
            alt="Avatar jucător"
            width={80}
            height={80}
            className="rounded-full border-2 border-green-500"
          />
          <div className="flex-1">
            <CardTitle className="text-3xl">{user.username}</CardTitle>
            <CardDescription className="text-gray-400">
              Nivel {user.level} | Rang: {user.rank}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">
              <span className="text-sm font-normal text-gray-400">Bani:</span> ${user.money}
            </p>
            <p className="text-lg font-bold text-yellow-500">
              <span className="text-sm font-normal text-gray-400">Experiență:</span> {user.experience}
            </p>
          </div>
        </CardHeader>
        <CardContent>
              <ProgressBars health={user.health} experience={user.experience} expToNextLevel={expToNextLevel} />
        </CardContent>
      </Card>
      
      {/* Secțiunea pentru misiunile utilizatorului */}
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 text-white ">
        <CardHeader>
          <CardTitle>Misiunile mele</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.quests.length > 0 ? (
              user.quests.map((userQuest) => {
                const isCompleted = userQuest.completed;
                const isClaimed = userQuest.claimed;
                const hasTime = userQuest.quest.time !== undefined && userQuest.quest.time !== null;

                const timerComponent = hasTime && !isCompleted ? (
                  <div className="mb-2 text-sm text-gray-400">
                    Timp rămas: <QuestTimer
                      startedAt={userQuest.startedAt!}
                      questTimeInMinutes={userQuest.quest.time!}
                      onTimerEnd={() => handleTimerEnd(userQuest.id)} // Funcție nouă
                    />
                  </div>
                ) : null;
                
                return (
                  <div key={userQuest.id} className="p-4 rounded-lg border border-gray-700 bg-gray-900 transition-colors hover:border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">{userQuest.quest.title}</h3>
                      {isClaimed ? (
                        <Badge className="bg-green-600 hover:bg-green-700">Revendicată</Badge>
                      ) : isCompleted ? (
                        <Badge className="bg-blue-600 hover:bg-blue-700">Finalizată</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">În curs</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{userQuest.quest.description}</p>
                    
                    {timerComponent}

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4 text-sm">
                        <span className="flex items-center text-green-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line></svg>
                          ${userQuest.quest.rewardMoney}
                        </span>
                        <span className="flex items-center text-yellow-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                          {userQuest.quest.rewardExp} EXP
                        </span>
                      </div>
                      {isCompleted && !isClaimed && (
                        <Button onClick={() => handleClaimReward(userQuest.id)}>Revendică</Button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">Nu ai misiuni acceptate în acest moment.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8 w-full max-w-4xl bg-gray-700" />

      {/* Secțiunea pentru misiunile disponibile */}
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Misiuni Disponibile</CardTitle>
          <CardDescription className="text-gray-400">
            Alege o misiune din cele de mai jos pentru a o accepta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableQuests.length > 0 ? (
              availableQuests.map((quest) => (
                <div key={quest.id} className="p-4 rounded-lg border border-gray-700 bg-gray-900 transition-colors hover:border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">{quest.title}</h3>
                    <Badge variant="outline" className="text-gray-400 border-gray-400">
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{quest.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm">
                      <span className="flex items-center text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" x2="12" y1="22" y2="12"></line></svg>
                        ${quest.rewardMoney}
                      </span>
                      <span className="flex items-center text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                        {quest.rewardExp} EXP
                      </span>
                    </div>
                    <Button onClick={() => handleAcceptQuest(quest.id)}>Acceptă</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Nu sunt misiuni disponibile în acest moment.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Separator className="my-8 w-full max-w-4xl bg-gray-700" />
            <div>
        <p className="flex items-center justify-center text-xl font-bold text-green-400">Harta Influenței Clanurilor</p>
        <RomaniaMap clanInfluence={clanInfluence} />
      </div>
      {/* Secțiunea pentru clasament */}
      <Card className="w-full max-w-4xl bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Clasament Top 5</CardTitle>
          <CardDescription className="text-gray-400">
            Vezi care sunt cei mai puternici jucători.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-400">Rank</TableHead>
                <TableHead className="text-gray-400">Jucător</TableHead>
                <TableHead className="text-gray-400 text-right">Nivel</TableHead>
                <TableHead className="text-gray-400 text-right">Bani</TableHead>
                <TableHead className="text-gray-400 text-right">Luptă</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                
              {leaderboard.map((player) => (
                <TableRow key={player.rank}>
                  <TableCell className="font-medium">{player.rank}</TableCell>
                  <TableCell>{player.username}</TableCell>
                  <TableCell className="text-right">{player.level}</TableCell>
                  <TableCell className="text-right text-green-400">${player.money}</TableCell>
                  <TableCell className="text-right">
                    {user && player.username !== user.username && (
                      <Button onClick={() => handleBattle(player.username)} variant="destructive" size="sm">Atacă</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Footer1 />
    </div>
  );
}