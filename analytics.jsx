import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, Brain, Calendar, BarChart3, Droplet, Moon, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import BodyMetricsChart from '../components/analytics/BodyMetricsChart';
import WorkoutConsistencyChart from '../components/analytics/WorkoutConsistencyChart';
import WellnessChart from '../components/analytics/WellnessChart';
import AIInsightsPanel from '../components/analytics/AIInsightsPanel';
import MetricSummaryCards from '../components/analytics/MetricSummaryCards';

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

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

  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return { start: subDays(now, 7), end: now };
      case 'month':
        return { start: subMonths(now, 1), end: now };
      case 'year':
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subDays(now, 7), end: now };
    }
  };

  const { data: dailyLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['analyticsLogs', user?.email, timeRange],
    queryFn: async () => {
      if (!user?.email) return [];
      const logs = await base44.entities.DailyLog.filter({ created_by: user.email }, '-log_date', 365);
      return logs;
    },
    enabled: !!user?.email,
    staleTime: 60000
  });

  const { data: profile } = useQuery({
    queryKey: ['analyticsProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0];
    },
    enabled: !!user?.email,
    staleTime: 60000
  });

  const { data: workoutPlan } = useQuery({
    queryKey: ['analyticsWorkout', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const plans = await base44.entities.WorkoutPlan.filter({ created_by: user.email }, '-created_date', 1);
      return plans[0];
    },
    enabled: !!user?.email,
    staleTime: 60000
  });

  const generateAIInsights = async () => {
    if (!dailyLogs || dailyLogs.length < 3) return;
    
    setIsLoadingInsights(true);
    try {
      const recentLogs = dailyLogs.slice(0, 30);
      const avgSleep = recentLogs.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / recentLogs.length;
      const avgWater = recentLogs.reduce((sum, log) => sum + (log.water_glasses || 0), 0) / recentLogs.length;
      const avgSteps = recentLogs.reduce((sum, log) => sum + (log.steps || 0), 0) / recentLogs.length;
      const totalWorkouts = recentLogs.reduce((sum, log) => sum + (log.exercises_completed?.length || 0), 0);

      const insights = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this fitness data and provide actionable insights:

User Profile:
- Fitness Goal: ${profile?.fitness_goal?.replace(/_/g, ' ') || 'general fitness'}
- Workout Intensity: ${profile?.workout_intensity || 'intermediate'}
- Current Weight: ${profile?.weight || 'N/A'} kg
- Body Type: ${profile?.body_type || 'N/A'}

Last 30 Days Summary:
- Average Sleep: ${avgSleep.toFixed(1)} hours/night
- Average Water: ${avgWater.toFixed(1)} glasses/day
- Average Steps: ${Math.round(avgSteps)}/day
- Total Workouts Completed: ${totalWorkouts} exercises

Daily Logs (recent ${recentLogs.length} days):
${recentLogs.slice(0, 10).map(log => 
  `Date: ${log.log_date}, Sleep: ${log.sleep_hours || 0}h, Water: ${log.water_glasses || 0}, Steps: ${log.steps || 0}, Exercises: ${log.exercises_completed?.length || 0}`
).join('\n')}

Provide 4-5 specific, actionable insights about:
1. Correlations between sleep, water, and workout performance
2. Patterns in their data (good and bad habits)
3. Specific recommendations for improvement
4. Predictions based on current trends

Be specific with numbers and percentages where possible.`,
        response_json_schema: {
          type: 'object',
          properties: {
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['positive', 'warning', 'suggestion', 'correlation'] },
                  metric: { type: 'string' }
                }
              }
            },
            overallScore: { type: 'number' },
            topRecommendation: { type: 'string' }
          }
        }
      });
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (dailyLogs && dailyLogs.length >= 3 && profile && !aiInsights) {
      generateAIInsights();
    }
  }, [dailyLogs, profile]);

  if (!user || logsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const dateRange = getDateRange();
  const filteredLogs = dailyLogs?.filter(log => {
    const logDate = new Date(log.log_date);
    return logDate >= dateRange.start && logDate <= dateRange.end;
  }) || [];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-600/15 via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-400/50">
              <BarChart3 className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
              Analytics
            </h1>
          </div>
          <p className="text-purple-200 font-medium">Track your cosmic fitness journey</p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Time Range Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="glass-cosmic-strong p-1 border border-purple-400/30">
              <TabsTrigger 
                value="week"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-semibold"
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-semibold"
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="year"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-purple-200 font-semibold"
              >
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Summary Cards */}
        <MetricSummaryCards logs={filteredLogs} timeRange={timeRange} />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <BodyMetricsChart profile={profile} timeRange={timeRange} />
          <WorkoutConsistencyChart logs={filteredLogs} workoutPlan={workoutPlan} timeRange={timeRange} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <WellnessChart logs={filteredLogs} type="sleep" timeRange={timeRange} />
          <WellnessChart logs={filteredLogs} type="water" timeRange={timeRange} />
        </div>

        {/* AI Insights Panel */}
        <AIInsightsPanel 
          insights={aiInsights} 
          isLoading={isLoadingInsights} 
          onRefresh={generateAIInsights}
        />
      </div>
    </div>
  );
}