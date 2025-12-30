import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Target, TrendingDown, Dumbbell, Wind, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const goals = [
  { value: 'weight_loss', label: 'Weight Loss', icon: TrendingDown, color: 'from-red-500 to-orange-500' },
  { value: 'muscle_gain', label: 'Muscle Gain', icon: Dumbbell, color: 'from-purple-500 to-pink-500' },
  { value: 'flexibility', label: 'Flexibility', icon: Wind, color: 'from-blue-500 to-cyan-500' },
  { value: 'posture_improvement', label: 'Posture', icon: Users, color: 'from-green-500 to-emerald-500' },
  { value: 'endurance', label: 'Endurance', icon: Zap, color: 'from-yellow-500 to-amber-500' }
];

export default function GoalsStep({ data, onUpdate, onNext, onBack }) {
  const [selectedGoal, setSelectedGoal] = useState(data.fitness_goal || '');

  const handleSubmit = () => {
    if (selectedGoal) {
      onUpdate({ fitness_goal: selectedGoal });
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto px-6 py-12"
    >
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Step 3 of 3</p>
            <h2 className="text-2xl font-bold text-gray-900">Your Fitness Goal</h2>
          </div>
        </div>
        <p className="text-gray-600">What would you like to focus on?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {goals.map((goal) => {
          const Icon = goal.icon;
          const isSelected = selectedGoal === goal.value;
          
          return (
            <motion.button
              key={goal.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedGoal(goal.value)}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all",
                isSelected
                  ? "border-transparent bg-gradient-to-br shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md",
                isSelected && goal.color
              )}
            >
              <div className={cn(
                "p-3 rounded-xl w-fit mb-3",
                isSelected ? "bg-white/20" : "bg-gray-100"
              )}>
                <Icon className={cn("w-6 h-6", isSelected ? "text-white" : "text-gray-700")} />
              </div>
              <h3 className={cn(
                "font-semibold text-lg",
                isSelected ? "text-white" : "text-gray-900"
              )}>
                {goal.label}
              </h3>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedGoal}
          className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          Complete Setup
        </Button>
      </div>
    </motion.div>
  );
}