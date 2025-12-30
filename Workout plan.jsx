import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ExerciseCard from '../components/workout/ExerciseCard';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutPlan() {
  const [user, setUser] = useState(null);
  const [activeDay, setActiveDay] = useState(format(new Date(), 'EEEE'));
  const queryClient = useQueryClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    getUser();
  }, []);

  const { data: workoutPlan, isLoading } = useQuery({
    queryKey: ['workoutPlan', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const plans = await base44.entities.WorkoutPlan.filter({ created_by: user.email }, '-created_date', 1);
      return plans[0];
    },
    enabled: !!user?.email,
    staleTime: 60000,
    refetchOnWindowFocus: false
  });

  const { data: dailyLog } = useQuery({
    queryKey: ['dailyLog', format(new Date(), 'yyyy-MM-dd'), user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const today = format(new Date(), 'yyyy-MM-dd');
      const logs = await base44.entities.DailyLog.filter({ 
        created_by: user.email,
        log_date: today
      });
      return logs[0];
    },
    enabled: !!user?.email,
    staleTime: 10000,
    refetchOnWindowFocus: false
  });

  const toggleExerciseMutation = useMutation({
    mutationFn: async (exerciseName) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedExercises = dailyLog?.exercises_completed || [];
      
      const isCompleted = completedExercises.some(ex => ex.exercise_name === exerciseName);
      
      let newExercises;
      if (isCompleted) {
        newExercises = completedExercises.filter(ex => ex.exercise_name !== exerciseName);
      } else {
        newExercises = [
          ...completedExercises,
          { exercise_name: exerciseName, completed_at: new Date().toISOString() }
        ];
      }

      if (dailyLog) {
        return base44.entities.DailyLog.update(dailyLog.id, {
          exercises_completed: newExercises
        });
      } else {
        return base44.entities.DailyLog.create({
          log_date: today,
          exercises_completed: newExercises
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dailyLog']);
    }
  });

  if (isLoading || !workoutPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const exercisesByDay = workoutPlan.exercises?.filter(ex => ex.day === activeDay) || [];
  const completedExerciseNames = dailyLog?.exercises_completed?.map(ex => ex.exercise_name) || [];

  return (
    <div className="min-h-screen pb-8 relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-400/50 backdrop-blur">
              <Calendar className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
              {workoutPlan.plan_name}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="glass-cosmic text-cyan-200 border-cyan-400/50 backdrop-blur font-semibold">
              <Target className="w-4 h-4 mr-1" strokeWidth={2.5} />
              {workoutPlan.goal?.replace(/_/g, ' ')}
            </Badge>
            <Badge className="glass-cosmic text-purple-200 border-purple-400/50 backdrop-blur font-semibold">
              <Zap className="w-4 h-4 mr-1" strokeWidth={2.5} />
              {workoutPlan.intensity}
            </Badge>
            <Badge className="glass-cosmic text-pink-200 border-pink-400/50 backdrop-blur font-semibold">
              {workoutPlan.duration_weeks} weeks
            </Badge>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 -mt-4">
        {/* Day Tabs */}
        <Tabs value={activeDay} onValueChange={setActiveDay} className="mb-6">
          <TabsList className="w-full glass-cosmic-strong p-2 h-auto flex-wrap justify-start border border-purple-400/30">
            {days.map((day) => {
              const dayExercises = workoutPlan.exercises?.filter(ex => ex.day === day) || [];
              const hasExercises = dayExercises.length > 0;
              
              return (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:via-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-[0_0_15px_rgba(139,92,246,0.6)] text-purple-200 font-medium disabled:text-purple-400/50 disabled:cursor-not-allowed"
                  disabled={!hasExercises}
                >
                  {day.substring(0, 3)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {days.map((day) => (
            <TabsContent key={day} value={day} className="mt-6">
              {exercisesByDay.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                      {exercisesByDay.length} Exercises
                    </h2>
                    <p className="text-sm text-purple-200 font-semibold glass-cosmic px-3 py-1 rounded-full border border-purple-400/30">
                      {completedExerciseNames.filter(name => 
                        exercisesByDay.some(ex => ex.exercise_name === name)
                      ).length} / {exercisesByDay.length} ✓
                    </p>
                  </div>
                  
                  {exercisesByDay.map((exercise, index) => (
                    <ExerciseCard
                      key={index}
                      exercise={exercise}
                      index={index}
                      isCompleted={completedExerciseNames.includes(exercise.exercise_name)}
                      onToggleComplete={() => toggleExerciseMutation.mutate(exercise.exercise_name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-cosmic-strong rounded-3xl border border-purple-400/30">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeWidth={2.5} />
                  </div>
                  <p className="text-white font-bold text-lg drop-shadow-lg">Rest day - No exercises scheduled 🌙</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}