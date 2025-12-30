import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, RefreshCw, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';

export default function NutritionInsights({ weeklyLogs, profile, dailyTotals }) {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async () => {
    if (!weeklyLogs || weeklyLogs.length < 2) return;
    
    setIsLoading(true);
    try {
      const avgCalories = weeklyLogs.reduce((sum, m) => sum + (m.total_calories || 0), 0) / weeklyLogs.length;
      const avgProtein = weeklyLogs.reduce((sum, m) => sum + (m.total_protein || 0), 0) / weeklyLogs.length;
      const avgCarbs = weeklyLogs.reduce((sum, m) => sum + (m.total_carbs || 0), 0) / weeklyLogs.length;
      const avgFat = weeklyLogs.reduce((sum, m) => sum + (m.total_fat || 0), 0) / weeklyLogs.length;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this nutrition data and provide insights for someone with a ${profile?.fitness_goal?.replace(/_/g, ' ') || 'general fitness'} goal:

User Profile:
- Fitness Goal: ${profile?.fitness_goal?.replace(/_/g, ' ') || 'general fitness'}
- Weight: ${profile?.weight || 70} kg
- Body Type: ${profile?.body_type || 'mesomorph'}
- Workout Intensity: ${profile?.workout_intensity || 'intermediate'}

Weekly Nutrition Averages (per day):
- Calories: ${Math.round(avgCalories)} kcal
- Protein: ${Math.round(avgProtein)}g
- Carbs: ${Math.round(avgCarbs)}g
- Fat: ${Math.round(avgFat)}g

Today's Intake:
- Calories: ${Math.round(dailyTotals.calories)} kcal
- Protein: ${Math.round(dailyTotals.protein)}g
- Carbs: ${Math.round(dailyTotals.carbs)}g
- Fat: ${Math.round(dailyTotals.fat)}g

Provide 3-4 specific, actionable nutrition insights:
1. How their current diet aligns with their fitness goal
2. Specific macro adjustments needed
3. Correlations between nutrition and potential workout performance
4. Meal timing or food suggestions

Be specific with numbers and percentages.`,
        response_json_schema: {
          type: 'object',
          properties: {
            goalAlignment: { type: 'number', description: 'Score 0-100 of how well diet aligns with goal' },
            insights: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  type: { type: 'string', enum: ['positive', 'warning', 'suggestion', 'correlation'] }
                }
              }
            },
            topRecommendation: { type: 'string' }
          }
        }
      });

      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (weeklyLogs && weeklyLogs.length >= 2 && profile && !insights) {
      generateInsights();
    }
  }, [weeklyLogs, profile]);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'suggestion': return Lightbulb;
      case 'correlation': return Target;
      default: return Lightbulb;
    }
  };

  const getInsightColors = (type) => {
    switch (type) {
      case 'positive': return { bg: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-400/50', icon: 'text-emerald-300' };
      case 'warning': return { bg: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-400/50', icon: 'text-amber-300' };
      case 'suggestion': return { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-400/50', icon: 'text-cyan-300' };
      case 'correlation': return { bg: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-400/50', icon: 'text-purple-300' };
      default: return { bg: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-400/50', icon: 'text-purple-300' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/50">
            <Brain className="w-6 h-6 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Nutrition AI</h3>
            <p className="text-sm text-purple-200">Diet insights & recommendations</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={generateInsights}
          disabled={isLoading}
          className="glass-cosmic border-purple-400/30 text-purple-200 hover:text-white"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-3" />
          <p className="text-purple-200">Analyzing your nutrition...</p>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          {/* Goal Alignment Score */}
          {insights.goalAlignment && (
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-20 h-20">
                    <circle cx="40" cy="40" r="32" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="6" fill="none" />
                    <circle
                      cx="40" cy="40" r="32"
                      stroke="url(#nutritionGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(insights.goalAlignment / 100) * 201} 201`}
                      transform="rotate(-90 40 40)"
                    />
                    <defs>
                      <linearGradient id="nutritionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-2xl font-bold text-white">{insights.goalAlignment}%</span>
                </div>
                <p className="text-purple-200 text-sm mt-2">Diet-Goal Alignment</p>
              </div>
            </div>
          )}

          {/* Top Recommendation */}
          {insights.topRecommendation && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-400/40">
              <p className="text-xs font-semibold text-cyan-300 uppercase mb-1">Top Recommendation</p>
              <p className="text-white font-medium">{insights.topRecommendation}</p>
            </div>
          )}

          {/* Insights */}
          <div className="grid gap-3">
            {insights.insights?.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const colors = getInsightColors(insight.type);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${colors.bg} border ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${colors.icon} mt-0.5 flex-shrink-0`} strokeWidth={2.5} />
                    <div>
                      <h4 className="font-semibold text-white">{insight.title}</h4>
                      <p className="text-sm text-purple-100 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-purple-200 mb-2">Log at least 2 meals to get AI insights</p>
          <p className="text-purple-300/70 text-sm">Start tracking your nutrition above</p>
        </div>
      )}
    </motion.div>
  );
}