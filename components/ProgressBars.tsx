'use client';

import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface ProgressBarsProps {
  health: number;
  experience: number;
  expToNextLevel: number;
}

export function ProgressBars({ health, experience, expToNextLevel }: ProgressBarsProps) {
  const [animatedHealth, setAnimatedHealth] = useState(0);
  const [animatedExp, setAnimatedExp] = useState(0);

  useEffect(() => {
    // Animație pentru bara de sănătate
    setAnimatedHealth(health);
  }, [health]);

  useEffect(() => {
    // Animație pentru bara de experiență
    setAnimatedExp(experience);
  }, [experience]);

  const expProgress = (animatedExp / expToNextLevel) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Sănătate</span>
          <span className="text-sm text-gray-400">{health}%</span>
        </div>
        <Progress value={animatedHealth} className="h-2 bg-gray-700 [&>div]:bg-red-500 transition-all duration-500" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-400">Experiență</span>
          <span className="text-sm text-gray-400">{experience} / {expToNextLevel}</span>
        </div>
        <Progress value={expProgress} className="h-2 bg-gray-700 [&>div]:bg-blue-500 transition-all duration-500" />
      </div>
    </div>
  );
}