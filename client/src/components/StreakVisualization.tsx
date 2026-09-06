import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProgressRing from "./ProgressRing";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Flame, Trophy, Target, Calendar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserStreak {
  id: number;
  sessionId: string;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  lastWorkoutDate: string | null;
  streakLevel: number;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

interface StreakVisualizationProps {
  sessionId: string;
  className?: string;
}

export default function StreakVisualization({ sessionId, className }: StreakVisualizationProps) {
  const queryClient = useQueryClient();
  const [isRecording, setIsRecording] = useState(false);
  const [showWorkout, setShowWorkout] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<string>("");
  const [showDay3Celebration, setShowDay3Celebration] = useState(false);



  const { data: streakData, isLoading } = useQuery({
    queryKey: ['/api/streak', sessionId],
    enabled: !!sessionId,
  });

  // Generate a quick workout based on current streak level
  const generateWorkout = (streakLevel: number) => {
    const workouts = [
      "💪 Quick Start (Level 1):\n• 10 Push-ups\n• 15 Squats\n• 30-second Plank\n• 10 Jumping Jacks",
      "🔥 Building Momentum (Level 2):\n• 15 Push-ups\n• 20 Squats\n• 45-second Plank\n• 15 Burpees\n• 20 Mountain Climbers",
      "⚡ Power Mode (Level 3):\n• 20 Push-ups\n• 25 Squats\n• 60-second Plank\n• 20 Burpees\n• 30 Mountain Climbers\n• 15 Jump Squats",
      "🚀 Beast Mode (Level 4+):\n• 25 Push-ups\n• 30 Squats\n• 90-second Plank\n• 25 Burpees\n• 40 Mountain Climbers\n• 20 Jump Squats\n• 15 Pike Push-ups"
    ];
    
    const index = Math.min(streakLevel - 1, workouts.length - 1);
    return workouts[index];
  };

  const recordWorkoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId })
      });
      if (!response.ok) {
        throw new Error("Failed to record workout");
      }
      return response.json();
    },
    onMutate: () => {
      setIsRecording(true);
    },
    onSuccess: (data) => {
      const newStreak = data?.streak?.currentStreak || 0;
      
      // Force immediate cache update with new data
      queryClient.setQueryData(['/api/streak', sessionId], {
        success: true,
        streak: data.streak
      });
      
      // Check for day 3 celebration
      if (newStreak === 3) {
        setTimeout(() => setShowDay3Celebration(true), 500);
      }
      
      // Complete the UI flow
      setIsRecording(false);
      setShowWorkout(false);
      
      // Invalidate queries after state updates
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['/api/streak'] });
        queryClient.invalidateQueries({ queryKey: ['/api/streak', sessionId] });
      }, 100);
    },
    onError: () => {
      setIsRecording(false);
    }
  });

  const streak: UserStreak | null = (streakData as any)?.streak || null;

  if (isLoading) {
    return (
      <div className={cn("p-4 bg-black border-2 border-white rounded-2xl", className)}>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse bg-gray-700 rounded-full w-24 h-24 mx-auto mb-3"></div>
            <div className="animate-pulse bg-gray-700 rounded w-16 h-3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentStreak = streak?.currentStreak || 0;
  const streakLevel = streak?.streakLevel || 1;
  const totalWorkouts = streak?.totalWorkouts || 0;
  const longestStreak = streak?.longestStreak || 0;
  const achievements = streak?.achievements || [];

  // Calculate progress toward next level (every 7 days)
  const progressToNextLevel = currentStreak > 0 ? ((currentStreak % 7) / 7) * 100 : 0;
  const nextLevelAt = Math.ceil((currentStreak || 1) / 7) * 7;

  // Check if workout was done today
  const today = new Date().toISOString().split('T')[0];
  const workoutDoneToday = streak?.lastWorkoutDate === today;

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your fitness journey!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return `${streak} days strong!`;
    if (streak < 14) return `Week ${Math.floor(streak / 7)} complete!`;
    if (streak < 30) return `${streak} days of dedication!`;
    return `${streak} days of consistency!`;
  };

  return (
    <div className={cn("p-4 bg-black border-2 border-white rounded-2xl", className)}>
      <div className="space-y-4">
        {showDay3Celebration ? (
          <div className="space-y-4 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="font-grunge text-xl uppercase tracking-tight text-primary">
              Congratulations!
            </h3>
            <p className="text-white font-grunge">
              You crushed the 3-day Launch Challenge! You've proven you're ready for the next level!
            </p>
            <div className="bg-primary text-black p-4 rounded-xl">
              <p className="font-grunge font-bold mb-2">🎁 Special Gift for Your Streak:</p>
              <p className="font-grunge text-lg font-bold">LAUNCHPROMO20</p>
              <p className="text-sm font-grunge">Use this code when setting up your profile in the app!</p>
            </div>
            <div className="space-y-3">
              <p className="text-white font-grunge">Download the app to unlock your full potential:</p>
              <div className="flex gap-2 justify-center">
                <a 
                  href="https://apps.apple.com/za/app/launch-lifestyle/id6743004197" 
                  target="_blank"
                  className="bg-white text-black px-4 py-2 rounded-lg font-grunge font-bold hover:bg-gray-200 transition-colors"
                >
                  App Store
                </a>
                <a 
                  href="https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share" 
                  target="_blank"
                  className="bg-white text-black px-4 py-2 rounded-lg font-grunge font-bold hover:bg-gray-200 transition-colors"
                >
                  Play Store
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowDay3Celebration(false)}
              className="bg-white/20 text-white font-grunge px-6 py-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              Continue Journey
            </button>
          </div>
        ) : showWorkout ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-grunge text-lg uppercase tracking-tight text-white mb-2">Today's Workout</h3>
              <div className="bg-primary text-black p-4 rounded-xl">
                <pre className="text-sm font-grunge whitespace-pre-wrap leading-relaxed">
                  {currentWorkout}
                </pre>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  recordWorkoutMutation.mutate();
                }}
                disabled={isRecording || recordWorkoutMutation.isPending}
                className="flex-1 bg-white text-black font-grunge font-bold py-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {isRecording || recordWorkoutMutation.isPending ? "Recording..." : "Complete Workout"}
              </button>
              <button
                onClick={() => setShowWorkout(false)}
                className="px-4 bg-white/20 text-white font-grunge rounded-xl hover:bg-white/30 transition-colors"
              >
                Back
              </button>
            </div>


          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="relative mx-auto w-fit">
                <ProgressRing
                  key={`progress-${currentStreak}-${totalWorkouts}`}
                  progress={currentStreak > 0 ? Math.min(100, (currentStreak / 30) * 100) : 0}
                  size={100}
                  strokeWidth={8}
                  color="#FAFF00"
                  backgroundColor="#374151"
                  className="drop-shadow-lg"
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Flame className="w-4 h-4 text-primary mr-1" />
                      <span className="text-xl font-grunge font-bold text-white">
                        {currentStreak}
                      </span>
                    </div>
                    <div className="text-[10px] text-white/60 font-grunge uppercase">
                      Days
                    </div>
                  </div>
                </ProgressRing>
                
                <div className="absolute -top-1 -right-1 bg-primary text-black px-2 py-1 rounded-full text-xs font-grunge font-bold">
                  Lv. {streakLevel}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm font-grunge font-bold text-white">
                  {getStreakMessage(currentStreak)}
                </p>
                {currentStreak > 0 && nextLevelAt > currentStreak && (
                  <p className="text-xs text-white/60 font-grunge mt-1">
                    {nextLevelAt - currentStreak} days to Level {streakLevel + 1}
                  </p>
                )}
              </div>
            </div>

            {/* Progress to Next Level */}
            {currentStreak > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/60 font-grunge">
                  <span>Level Progress</span>
                  <span>{currentStreak % 7}/7 days</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressToNextLevel}%` }}
                  />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center justify-center mb-1">
                  <Target className="w-4 h-4 text-primary mr-1" />
                  <span className="text-lg font-grunge font-bold text-white">
                    {totalWorkouts}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-grunge">Total Workouts</p>
              </div>
              
              <div className="text-center p-3 bg-white/10 rounded-lg border border-white/20">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="w-4 h-4 text-primary mr-1" />
                  <span className="text-lg font-grunge font-bold text-white">
                    {longestStreak}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-grunge">Best Streak</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2 space-y-3">
              {workoutDoneToday ? (
                <div className="text-center p-3 bg-primary/20 rounded-lg border border-primary/30">
                  <div className="flex items-center justify-center text-primary">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="text-sm font-grunge font-bold">Workout completed today!</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    const workout = generateWorkout(streakLevel);
                    setCurrentWorkout(workout);
                    setShowWorkout(true);
                  }}
                  className="w-full bg-primary text-black font-grunge font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2 inline" />
                  Start Today's Workout
                </button>
              )}

              {/* Back to Chat Button */}
              <button
                onClick={() => {
                  const event = new CustomEvent('switchToChatView');
                  window.dispatchEvent(event);
                }}
                className="w-full bg-white/10 text-white font-grunge py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/30"
              >
                ← Back to Chat
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}