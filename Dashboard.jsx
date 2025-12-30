import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Award, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import StatsCard from '../components/dashboard/StatsCard';
import TodayWorkout from '../components/dashboard/TodayWorkout';
import QuickTracker from '../components/dashboard/QuickTracker';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
        if (profiles.length === 0 || !profiles[0].onboarding_completed) {
          navigate(createPageUrl('Onboarding'));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate(createPageUrl('Home'));
      }
    };
    checkUser();
  }, [navigate]);

  const { data: profile } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0];
    },
    enabled: !!user?.email,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  const { data: workoutPlan } = useQuery({
    queryKey: ['workoutPlan', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const plans = await base44.entities.WorkoutPlan.filter({ created_by: user.email }, '-created_date', 1);
      return plans[0];
    },
    enabled: !!user?.email,
    staleTime: 30000,
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

  const updateLogMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const fieldMap = {
        water: 'water_glasses',
        sleep: 'sleep_hours',
        steps: 'steps'
      };
      
      const updateData = { [fieldMap[field]]: value };

      if (dailyLog) {
        return base44.entities.DailyLog.update(dailyLog.id, updateData);
      } else {
        return base44.entities.DailyLog.create({
          log_date: today,
          ...updateData
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dailyLog']);
    }
  });

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const todayExercises = workoutPlan?.exercises?.filter(
    ex => ex.day === format(new Date(), 'EEEE')
  ) || [];

  return (
    <div className="min-h-screen pb-8 relative overflow-hidden">
      {/* Cosmic background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
            Welcome back, {user.full_name?.split(' ')[0]}! ✨
          </h1>
          <p className="text-xl text-purple-200 font-medium">Let's crush today's cosmic goals</p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-400/50">
                <Award className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-200 mb-1">Posture Score</p>
                <p className="text-3xl font-bold text-white drop-shadow-lg">{profile.posture_score || 0}/100</p>
              </div>
            </div>
            <p className="text-sm text-purple-300">Keep improving! 🌟</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/50">
                <Target className="w-7 h-7 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-200 mb-1">Symmetry</p>
                <p className="text-3xl font-bold text-white drop-shadow-lg">{profile.symmetry_score || 0}/100</p>
              </div>
            </div>
            <p className="text-sm text-purple-300">Well balanced ⚖️</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500/30 to-pink-600/30 border border-pink-400/50">
                <TrendingUp className="w-7 h-7 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" strokeWidth={2.5} />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-purple-200 mb-1">Level</p>
                <p className="text-2xl font-bold text-white drop-shadow-lg capitalize">{profile.workout_intensity || 'Beginner'}</p>
              </div>
            </div>
            <p className="text-sm text-purple-300 capitalize">{profile.fitness_goal?.replace(/_/g, ' ')}</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <TodayWorkout
            exercises={todayExercises}
            onStartWorkout={() => navigate(createPageUrl('WorkoutPlan'))}
          />
          <QuickTracker
            dailyLog={dailyLog}
            onUpdate={(field, value) => updateLogMutation.mutate({ field, value })}
          />
        </div>
      </div>
    </div>
  );
}