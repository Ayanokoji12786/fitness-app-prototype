import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DailyNutritionSummary({ totals, profile }) {
  // Calculate targets based on profile
  const getTargets = () => {
    const weight = profile?.weight || 70;
    const goal = profile?.fitness_goal || 'weight_loss';
    
    let calorieTarget = weight * 30; // Base
    let proteinTarget = weight * 1.6;
    let carbTarget, fatTarget;

    if (goal === 'muscle_gain') {
      calorieTarget = weight * 35;
      proteinTarget = weight * 2;
      carbTarget = calorieTarget * 0.45 / 4;
      fatTarget = calorieTarget * 0.25 / 9;
    } else if (goal === 'weight_loss') {
      calorieTarget = weight * 25;
      proteinTarget = weight * 1.8;
      carbTarget = calorieTarget * 0.35 / 4;
      fatTarget = calorieTarget * 0.30 / 9;
    } else {
      carbTarget = calorieTarget * 0.45 / 4;
      fatTarget = calorieTarget * 0.25 / 9;
    }

    return {
      calories: Math.round(calorieTarget),
      protein: Math.round(proteinTarget),
      carbs: Math.round(carbTarget),
      fat: Math.round(fatTarget)
    };
  };

  const targets = getTargets();

  const metrics = [
    { 
      label: 'Calories', 
      value: Math.round(totals.calories), 
      target: targets.calories, 
      unit: 'kcal',
      icon: Flame,
      color: 'from-orange-500/30 to-red-500/30',
      borderColor: 'border-orange-400/50',
      iconColor: 'text-orange-300',
      progressColor: 'bg-gradient-to-r from-orange-400 to-red-400'
    },
    { 
      label: 'Protein', 
      value: Math.round(totals.protein), 
      target: targets.protein, 
      unit: 'g',
      icon: Beef,
      color: 'from-red-500/30 to-pink-500/30',
      borderColor: 'border-red-400/50',
      iconColor: 'text-red-300',
      progressColor: 'bg-gradient-to-r from-red-400 to-pink-400'
    },
    { 
      label: 'Carbs', 
      value: Math.round(totals.carbs), 
      target: targets.carbs, 
      unit: 'g',
      icon: Wheat,
      color: 'from-amber-500/30 to-yellow-500/30',
      borderColor: 'border-amber-400/50',
      iconColor: 'text-amber-300',
      progressColor: 'bg-gradient-to-r from-amber-400 to-yellow-400'
    },
    { 
      label: 'Fat', 
      value: Math.round(totals.fat), 
      target: targets.fat, 
      unit: 'g',
      icon: Droplets,
      color: 'from-cyan-500/30 to-blue-500/30',
      borderColor: 'border-cyan-400/50',
      iconColor: 'text-cyan-300',
      progressColor: 'bg-gradient-to-r from-cyan-400 to-blue-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 gap-3 mb-6"
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const percentage = Math.min((metric.value / metric.target) * 100, 100);
        
        return (
          <div
            key={metric.label}
            className={`glass-cosmic-strong rounded-2xl p-4 border ${metric.borderColor}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.color} border ${metric.borderColor}`}>
                <Icon className={`w-4 h-4 ${metric.iconColor} drop-shadow-[0_0_6px_currentColor]`} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-purple-200">{metric.label}</span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-white">{metric.value}</span>
              <span className="text-purple-300 text-sm"> / {metric.target}{metric.unit}</span>
            </div>
            <div className="w-full bg-purple-900/40 rounded-full h-2 border border-purple-400/20">
              <div 
                className={`h-full rounded-full ${metric.progressColor} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}