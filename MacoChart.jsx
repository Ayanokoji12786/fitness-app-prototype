import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export default function MacroChart({ totals }) {
  const data = [
    { name: 'Protein', value: totals.protein * 4, color: '#f472b6' },
    { name: 'Carbs', value: totals.carbs * 4, color: '#fbbf24' },
    { name: 'Fat', value: totals.fat * 9, color: '#22d3ee' }
  ];

  const totalCalories = data.reduce((sum, d) => sum + d.value, 0);

  if (totalCalories === 0) {
    return null;
  }

  const CustomLabel = ({ cx, cy }) => (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-0.5em" className="fill-white text-2xl font-bold">{Math.round(totalCalories)}</tspan>
      <tspan x={cx} dy="1.5em" className="fill-purple-300 text-xs">calories</tspan>
    </text>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-400/50">
          <PieIcon className="w-5 h-5 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg font-bold text-white">Macro Breakdown</h3>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              label={CustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm text-purple-200">
              {entry.name} ({Math.round((entry.value / totalCalories) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}