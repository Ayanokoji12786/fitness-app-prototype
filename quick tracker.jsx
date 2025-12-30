import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Droplet, Moon, Footprints, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuickTracker({ dailyLog, onUpdate }) {
  const [water, setWater] = useState(dailyLog?.water_glasses || 0);
  const [sleep, setSleep] = useState(dailyLog?.sleep_hours || 0);
  const [steps, setSteps] = useState(dailyLog?.steps || 0);

  const handleUpdate = (field, value) => {
    const newValue = Math.max(0, value);
    if (field === 'water') setWater(newValue);
    if (field === 'sleep') setSleep(newValue);
    if (field === 'steps') setSteps(newValue);
    onUpdate(field, newValue);
  };

  const trackers = [
    {
      label: 'Water',
      value: water,
      target: 8,
      unit: 'glasses',
      icon: Droplet,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
      field: 'water',
      step: 1
    },
    {
      label: 'Sleep',
      value: sleep,
      target: 8,
      unit: 'hours',
      icon: Moon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      field: 'sleep',
      step: 0.5
    },
    {
      label: 'Steps',
      value: steps,
      target: 10000,
      unit: 'steps',
      icon: Footprints,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100',
      field: 'steps',
      step: 1000
    }
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Quick Track</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {trackers.map((tracker, index) => {
          const Icon = tracker.icon;
          const progress = Math.min((tracker.value / tracker.target) * 100, 100);
          
          return (
            <motion.div
              key={tracker.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("p-2 rounded-lg", tracker.bgColor)}>
                    <Icon className={cn("w-4 h-4", tracker.color)} />
                  </div>
                  <span className="font-medium text-gray-900">{tracker.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => handleUpdate(tracker.field, tracker.value - tracker.step)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-semibold text-gray-700 min-w-16 text-center">
                    {tracker.value} / {tracker.target}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => handleUpdate(tracker.field, tracker.value + tracker.step)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}