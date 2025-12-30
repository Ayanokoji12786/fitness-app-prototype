import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Scale, Ruler } from 'lucide-react';

export default function BodyMetricsChart({ profile, timeRange }) {
  // Generate sample historical data based on current profile
  // In a real app, you'd store historical measurements
  const generateHistoricalData = () => {
    if (!profile) return [];
    
    const data = [];
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const baseWeight = profile.weight || 70;
    const baseWaist = profile.waist || 80;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate gradual improvement with some variance
      const progress = (days - i) / days;
      const variance = (Math.random() - 0.5) * 2;
      
      data.push({
        date: timeRange === 'year' 
          ? date.toLocaleDateString('en-US', { month: 'short' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: Math.round((baseWeight - progress * 2 + variance) * 10) / 10,
        waist: Math.round((baseWaist - progress * 3 + variance) * 10) / 10,
      });
    }
    
    // Reduce data points for better visualization
    if (timeRange === 'year') {
      const monthlyData = [];
      for (let i = 0; i < data.length; i += 30) {
        monthlyData.push(data[i]);
      }
      return monthlyData;
    }
    
    return data;
  };

  const data = generateHistoricalData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-cosmic-strong rounded-lg p-3 border border-purple-400/30">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name === 'weight' ? 'kg' : 'cm'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50">
          <Scale className="w-5 h-5 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white drop-shadow-lg">Body Metrics</h3>
          <p className="text-xs text-purple-200">Weight & waist trends</p>
        </div>
      </div>

      {data.length > 0 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.2)" />
              <XAxis 
                dataKey="date" 
                stroke="#a78bfa" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#a78bfa" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#a78bfa" 
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(139, 92, 246, 0.3)' }}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span className="text-purple-200 text-sm">{value}</span>}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="weight" 
                stroke="#22d3ee" 
                strokeWidth={3}
                dot={{ fill: '#22d3ee', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#fff', strokeWidth: 2 }}
                name="Weight (kg)"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="waist" 
                stroke="#ec4899" 
                strokeWidth={3}
                dot={{ fill: '#ec4899', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
                name="Waist (cm)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-purple-300 text-center">No body metrics data available yet</p>
        </div>
      )}
    </motion.div>
  );
}