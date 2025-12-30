import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Coffee, Sun, Moon, Cookie } from 'lucide-react';

const mealConfig = {
  breakfast: { icon: Coffee, label: 'Breakfast', gradient: 'from-amber-500/30 to-orange-500/30', border: 'border-amber-400/50', iconColor: 'text-amber-300' },
  lunch: { icon: Sun, label: 'Lunch', gradient: 'from-yellow-500/30 to-lime-500/30', border: 'border-yellow-400/50', iconColor: 'text-yellow-300' },
  dinner: { icon: Moon, label: 'Dinner', gradient: 'from-indigo-500/30 to-purple-500/30', border: 'border-indigo-400/50', iconColor: 'text-indigo-300' },
  snack: { icon: Cookie, label: 'Snacks', gradient: 'from-pink-500/30 to-rose-500/30', border: 'border-pink-400/50', iconColor: 'text-pink-300' }
};

export default function MealCard({ mealType, meal, index, onAdd, onDelete }) {
  const config = mealConfig[mealType];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.05 }}
      className={`glass-cosmic-strong rounded-2xl p-4 border ${config.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${config.gradient} border ${config.border}`}>
            <Icon className={`w-5 h-5 ${config.iconColor} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-white">{config.label}</h3>
            {meal && (
              <p className="text-xs text-purple-300">{meal.foods?.length || 0} items • {Math.round(meal.total_calories || 0)} kcal</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {meal && (
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="h-9 w-9 text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          )}
          <Button
            size="icon"
            onClick={onAdd}
            className={`h-9 w-9 bg-gradient-to-br ${config.gradient} border ${config.border} hover:opacity-80`}
          >
            <Plus className="w-4 h-4 text-white" strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      {meal && meal.foods && meal.foods.length > 0 && (
        <div className="space-y-2">
          {meal.foods.map((food, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-purple-900/30">
              <div>
                <p className="text-sm font-medium text-white">{food.name}</p>
                <p className="text-xs text-purple-300">{food.serving_size}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{food.calories} kcal</p>
                <p className="text-xs text-purple-300">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {(!meal || !meal.foods || meal.foods.length === 0) && (
        <p className="text-sm text-purple-300/70 text-center py-2">No foods logged yet</p>
      )}
    </motion.div>
  );
}