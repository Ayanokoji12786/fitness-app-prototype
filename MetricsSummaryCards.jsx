import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Moon, Footprints, Dumbbell, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricSummaryCards({ logs, timeRange }) {
  const calculateMetrics = () => {
    if (!logs || logs.length === 0) {
      return {
        avgWater: 0,
        avgSleep: 0,
        avgSteps: 0,
        totalWorkouts: 0,
        waterTrend: 0,
        sleepTrend: 0,
        stepsTrend: 0,
        workoutTrend: 0
      };
    }

    const halfLength = Math.floor(logs.length / 2);
    const recentHalf = logs.slice(0, halfLength);
    const olderHalf = logs.slice(halfLength);

    const avgWater = logs.reduce((sum, log) => sum + (log.water_glasses || 0), 0) / logs.length;
    const avgSleep = logs.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / logs.length;
    const avgSteps = logs.reduce((sum, log) => sum + (log.steps || 0), 0) / logs.length;
    const totalWorkouts = logs.reduce((sum, log) => sum + (log.exercises_completed?.length || 0), 0);

    const recentWater = recentHalf.length > 0 ? recentHalf.reduce((sum, log) => sum + (log.water_glasses || 0), 0) / recentHalf.length : 0;
    const olderWater = olderHalf.length > 0 ? olderHalf.reduce((sum, log) => sum + (log.water_glasses || 0), 0) / olderHalf.length : 0;
    const waterTrend = olderWater > 0 ? ((recentWater - olderWater) / olderWater) * 100 : 0;

    const recentSleep = recentHalf.length > 0 ? recentHalf.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / recentHalf.length : 0;
    const olderSleep = olderHalf.length > 0 ? olderHalf.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / olderHalf.length : 0;
    const sleepTrend = olderSleep > 0 ? ((recentSleep - olderSleep) / olderSleep) * 100 : 0;

    const recentSteps = recentHalf.length > 0 ? recentHalf.reduce((sum, log) => sum + (log.steps || 0), 0) / recentHalf.length : 0;
    const olderSteps = olderHalf.length > 0 ? olderHalf.reduce((sum, log) => sum + (log.steps || 0), 0) / olderHalf.length : 0;
    const stepsTrend = olderSteps > 0 ? ((recentSteps - olderSteps) / olderSteps) * 100 : 0;

    const recentWorkouts = recentHalf.reduce((sum, log) => sum + (log.exercises_completed?.length || 0), 0);
    const olderWorkouts = olderHalf.reduce((sum, log) => sum + (log.exercises_completed?.length || 0), 0);
    const workoutTrend = olderWorkouts > 0 ? ((recentWorkouts - olderWorkouts) / olderWorkouts) * 100 : 0;

    return {
      avgWater: avgWater.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      avgSteps: Math.round(avgSteps),
      totalWorkouts,
      waterTrend,
      sleepTrend,
      stepsTrend,
      workoutTrend
    };
  };

  const metrics = calculateMetrics();

  const cards = [
    {
      title: 'Avg Water',
      value: `${metrics.avgWater}`,
      unit: 'glasses/day',
      trend: metrics.waterTrend,
      icon: Droplet,
      gradient: 'from-cyan-500/30 to-blue-500/30',
      iconColor: 'text-cyan-300',
      borderColor: 'border-cyan-400/50'
    },
    {
      title: 'Avg Sleep',
      value: `${metrics.avgSleep}`,
      unit: 'hours/night',
      trend: metrics.sleepTrend,
      icon: Moon,
      gradient: 'from-purple-500/30 to-indigo-500/30',
      iconColor: 'text-purple-300',
      borderColor: 'border-purple-400/50'
    },
    {
      title: 'Avg Steps',
      value: metrics.avgSteps.toLocaleString(),
      unit: 'steps/day',
      trend: metrics.stepsTrend,
      icon: Footprints,
      gradient: 'from-pink-500/30 to-rose-500/30',
      iconColor: 'text-pink-300',
      borderColor: 'border-pink-400/50'
    },
    {
      title: 'Workouts',
      value: metrics.totalWorkouts,
      unit: 'exercises done',
      trend: metrics.workoutTrend,
      icon: Dumbbell,
      gradient: 'from-emerald-500/30 to-green-500/30',
      iconColor: 'text-emerald-300',
      borderColor: 'border-emerald-400/50'
    }
  ];

  const TrendIcon = ({ trend }) => {
    if (trend > 5) return <TrendingUp className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />;
    if (trend < -5) return <TrendingDown className="w-4 h-4 text-red-400" strokeWidth={2.5} />;
    return <Minus className="w-4 h-4 text-purple-300" strokeWidth={2.5} />;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`glass-cosmic-strong rounded-2xl p-4 border ${card.borderColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${card.gradient} border ${card.borderColor}`}>
                <Icon className={`w-5 h-5 ${card.iconColor} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon trend={card.trend} />
                <span className={`text-xs font-semibold ${card.trend > 0 ? 'text-emerald-400' : card.trend < 0 ? 'text-red-400' : 'text-purple-300'}`}>
                  {Math.abs(card.trend).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white drop-shadow-lg">{card.value}</p>
            <p className="text-xs text-purple-200 font-medium">{card.unit}</p>
          </motion.div>
        );
      })}
    </div>
  );
}