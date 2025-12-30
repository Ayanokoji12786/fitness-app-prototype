import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dumbbell, Target } from 'lucide-react';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, subDays } from 'date-fns';

export default function WorkoutConsistencyChart({ logs, workoutPlan, timeRange }) {
  const processData = () => {
    if (!logs || logs.length === 0) return [];

    if (timeRange === 'week') {
      // Daily view for week
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayLog = logs.find(log => log.log_date === dateStr);
        const exerciseCount = dayLog?.exercises_completed?.length || 0;
        
        // Get expected exercises for this day from workout plan
        const dayName = format(date, 'EEEE');
        const expectedExercises = workoutPlan?.exercises?.filter(ex => ex.day === dayName).length || 0;
        
        last7Days.push({
          date: format(date, 'EEE'),
          completed: exerciseCount,
          expected: expectedExercises,
          percentage: expectedExercises > 0 ? Math.round((exerciseCount / expectedExercises) * 100) : 0
        });
      }
      return last7Days;
    } else if (timeRange === 'month') {
      // Weekly aggregates for month
      const weeks = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = startOfWeek(subDays(new Date(), i * 7));
        const weekEnd = endOfWeek(subDays(new Date(), i * 7));
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        let totalCompleted = 0;
        let totalExpected = 0;
        
        weekDays.forEach(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayLog = logs.find(log => log.log_date === dateStr);
          totalCompleted += dayLog?.exercises_completed?.length || 0;
          
          const dayName = format(day, 'EEEE');
          totalExpected += workoutPlan?.exercises?.filter(ex => ex.day === dayName).length || 0;
        });
        
        weeks.push({
          date: `Week ${4 - i}`,
          completed: totalCompleted,
          expected: totalExpected,
          percentage: totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0
        });
      }
      return weeks;
    } else {
      // Monthly aggregates for year
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(monthDate.getMonth() - i);
        const monthName = format(monthDate, 'MMM');
        
        const monthLogs = logs.filter(log => {
          const logDate = new Date(log.log_date);
          return logDate.getMonth() === monthDate.getMonth() && 
                 logDate.getFullYear() === monthDate.getFullYear();
        });
        
        const totalCompleted = monthLogs.reduce((sum, log) => sum + (log.exercises_completed?.length || 0), 0);
        
        months.push({
          date: monthName,
          completed: totalCompleted,
          expected: 60, // Assume ~60 exercises expected per month
          percentage: Math.min(Math.round((totalCompleted / 60) * 100), 100)
        });
      }
      return months;
    }
  };

  const data = processData();
  const avgCompletion = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.percentage, 0) / data.length) 
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-cosmic-strong rounded-lg p-3 border border-purple-400/30">
          <p className="text-white font-semibold mb-2">{label}</p>
          <p className="text-sm text-cyan-300">Completed: {payload[0].value} exercises</p>
          <p className="text-sm text-purple-300">Expected: {payload[0].payload.expected}</p>
          <p className="text-sm text-emerald-300">Rate: {payload[0].payload.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return '#22c55e';
    if (percentage >= 50) return '#eab308';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-400/50">
            <Dumbbell className="w-5 h-5 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-lg">Workout Consistency</h3>
            <p className="text-xs text-purple-200">Exercise completion rate</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white drop-shadow-lg">{avgCompletion}%</p>
          <p className="text-xs text-purple-200">avg completion</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="#a78bfa" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
              />
              <YAxis 
                stroke="#a78bfa" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="completed" 
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-purple-300 text-center">No workout data available yet</p>
        </div>
      )}

      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-purple-200">≥80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-purple-200">50-79%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-purple-200">&lt;50%</span>
        </div>
      </div>
    </motion.div>
  );
}