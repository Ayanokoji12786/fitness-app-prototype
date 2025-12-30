import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, Apple, Plus, Brain, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import DailyNutritionSummary from '../components/nutrition/DailyNutritionSummary';
import MealCard from '../components/nutrition/MealCard';
import AddMealModal from '../components/nutrition/AddMealModal';
import NutritionInsights from '../components/nutrition/NutritionInsights';
import MacroChart from '../components/nutrition/MacroChart';

export default function Nutrition() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
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

  const { data: mealLogs, isLoading } = useQuery({
    queryKey: ['mealLogs', user?.email, selectedDate],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.MealLog.filter({ 
        created_by: user.email,
        log_date: selectedDate
      });
    },
    enabled: !!user?.email,
    staleTime: 30000
  });

  const { data: profile } = useQuery({
    queryKey: ['nutritionProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles[0];
    },
    enabled: !!user?.email,
    staleTime: 60000
  });

  const { data: weeklyLogs } = useQuery({
    queryKey: ['weeklyMealLogs', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.MealLog.filter({ created_by: user.email }, '-log_date', 50);
    },
    enabled: !!user?.email,
    staleTime: 60000
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId) => {
      return await base44.entities.MealLog.delete(mealId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mealLogs']);
      queryClient.invalidateQueries(['weeklyMealLogs']);
    }
  });

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  const dailyTotals = mealLogs?.reduce((acc, meal) => ({
    calories: acc.calories + (meal.total_calories || 0),
    protein: acc.protein + (meal.total_protein || 0),
    carbs: acc.carbs + (meal.total_carbs || 0),
    fat: acc.fat + (meal.total_fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-600/15 via-transparent to-transparent" />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/50">
              <Apple className="w-7 h-7 text-green-300 drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]">
              Nutrition
            </h1>
          </div>
          <p className="text-purple-200 font-medium">Track your meals & macros</p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Date Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="glass-cosmic-strong rounded-xl px-4 py-3 text-white border border-purple-400/30 bg-transparent w-full"
          />
        </motion.div>

        {/* Daily Summary */}
        <DailyNutritionSummary totals={dailyTotals} profile={profile} />

        {/* Macro Chart */}
        <MacroChart totals={dailyTotals} />

        {/* Meals */}
        <div className="space-y-4 mb-6">
          {mealTypes.map((mealType, index) => {
            const meal = mealLogs?.find(m => m.meal_type === mealType);
            return (
              <MealCard
                key={mealType}
                mealType={mealType}
                meal={meal}
                index={index}
                onAdd={() => { setSelectedMealType(mealType); setShowAddMeal(true); }}
                onDelete={() => meal && deleteMealMutation.mutate(meal.id)}
              />
            );
          })}
        </div>

        {/* AI Insights */}
        <NutritionInsights 
          weeklyLogs={weeklyLogs} 
          profile={profile} 
          dailyTotals={dailyTotals}
        />
      </div>

      {/* Add Meal Modal */}
      <AddMealModal
        open={showAddMeal}
        onClose={() => setShowAddMeal(false)}
        mealType={selectedMealType}
        selectedDate={selectedDate}
        userEmail={user?.email}
      />
    </div>
  );
}