import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Moon, Droplet } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function WellnessChart({ logs, type, timeRange }) {
  const config = {
    sleep: {
      icon: Moon,
      title: 'Sleep Quality',
      subtitle: 'Hours of sleep per night',
      dataKey: 'sleep_hours',
      color: '#a78bfa',
      gradientId: 'sleepGradient',
      target: 8,
      unit: 'hrs',
      gradient: 'from-purple-500/30 to-indigo-500/30',
      borderColor: 'border-purple-400/50'
    },
    water: {
      icon: Droplet,
      title: 'Hydration',
      subtitle: 'Glasses of water per day',
      dataKey: 'water_glasses',
      color: '#22d3ee',
      gradientId: 'waterGradient',
      target: 8,
      unit: 'glasses',
      gradient: 'from-cyan-500/30 to-blue-500/30',
      borderColor: 'border-cyan-400/50'
    }
  };

  const cfg = config[type];
  const Icon = cfg.icon;

  const processData = () => {
    if (!logs || logs.length === 0) return [];

    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLog = logs.find(log => log.log_date === dateStr);
      
      data.push({
        date: timeRange === 'year' 
          ? format(date, 'MMM')
          : format(date, 'MMM d'),
        value: dayLog?.[cfg.dataKey] || 0,
        target: cfg.target
      });
    }

    // Reduce data points for year view
    if (timeRange === 'year') {
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        const monthStart = i * 30;
        const monthEnd = Math.min((i + 1) * 30, data.length);
        const monthSlice = data.slice(monthStart, monthEnd);
        const avg = monthSlice.length > 0 
          ? monthSlice.reduce((sum, d) => sum + d.value, 0) / monthSlice.length 
          : 0;
        if (monthSlice.length > 0) {
          monthlyData.push({
            date: monthSlice[0].date,
            value: Math.round(avg * 10) / 10,
            target: cfg.target
          });
        }
      }
      return monthlyData;
    }

    return data;
  };

  const data = processData();
  const avgValue = data.length > 0 
    ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1) 
    : 0;
  const targetMet = data.filter(d => d.value >= cfg.target).length;
  const targetPercentage = data.length > 0 ? Math.round((targetMet / data.length) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const meetsTarget = value >= cfg.target;
      return (
        <div className="glass-cosmic-strong rounded-lg p-3 border border-purple-400/30">
          <p className="text-white font-semibold mb-2">{label}</p>
          <p className="text-sm" style={{ color: cfg.color }}>
            {value} {cfg.unit}
          </p>
          <p className={`text-xs mt-1 ${meetsTarget ? 'text-emerald-400' : 'text-amber-400'}`}>
            {meetsTarget ? '✓ Target met' : `${(cfg.target - value).toFixed(1)} below target`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: type === 'sleep' ? 0.3 : 0.35 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${cfg.gradient} border ${cfg.borderColor}`}>
            <Icon className={`w-5 h-5 drop-shadow-[0_0_8px_currentColor]`} style={{ color: cfg.color }} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white drop-shadow-lg">{cfg.title}</h3>
            <p className="text-xs text-purple-200">{cfg.subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white drop-shadow-lg">{avgValue}</p>
          <p className="text-xs text-purple-200">avg {cfg.unit}</p>
        </div>
      </div>

      {data.length > 0 ? (
        <>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={cfg.gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cfg.color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={cfg.color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#a78bfa" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
                  interval={timeRange === 'week' ? 0 : 'preserveStartEnd'}
                />
                <YAxis 
                  stroke="#a78bfa" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
                  domain={[0, 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine 
                  y={cfg.target} 
                  stroke="#22c55e" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={cfg.color}
                  strokeWidth={3}
                  fill={`url(#${cfg.gradientId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-400/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-emerald-500" style={{ borderStyle: 'dashed' }} />
              <span className="text-xs text-purple-200">Target: {cfg.target} {cfg.unit}</span>
            </div>
            <div className="glass-cosmic px-3 py-1 rounded-full border border-purple-400/30">
              <span className="text-xs font-semibold text-purple-200">
                {targetPercentage}% days hit target
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-48 flex items-center justify-center">
          <p className="text-purple-300 text-center">No {type} data available yet</p>
        </div>
      )}
    </motion.div>
  );
}