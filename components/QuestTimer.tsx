import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils'; // Vei crea această funcție

interface QuestTimerProps {
  startedAt: string;
  questTimeInMinutes: number;
  userQuestId: string; // Adaugă acest prop
  onTimerEnd: (userQuestId: string) => void; // Modifică semnătura
}

export function QuestTimer({ startedAt, questTimeInMinutes, userQuestId, onTimerEnd }: QuestTimerProps) {
  const questEndTime = new Date(startedAt).getTime() + questTimeInMinutes * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.floor((questEndTime - new Date().getTime()) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((questEndTime - new Date().getTime()) / 1000));
      setTimeLeft(remainingTime);

      if (remainingTime <= 0) {
        clearInterval(timer);
        onTimerEnd(userQuestId); // Trimite ID-ul înapoi
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [questEndTime, onTimerEnd, userQuestId]);

  if (timeLeft <= 0) {
    return <span className="text-red-500 font-bold">Expirată</span>;
  }

  return (
    <span className="text-yellow-500 font-bold">
      {formatTime(timeLeft)}
    </span>
  );
}