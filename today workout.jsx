import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Dumbbell, Clock, Repeat, Play } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors = {
  cardio: 'bg-red-100 text-red-700',
  strength: 'bg-purple-100 text-purple-700',
  flexibility: 'bg-blue-100 text-blue-700',
  balance: 'bg-green-100 text-green-700'
};

export default function TodayWorkout({ exercises, onStartWorkout }) {
  if (!exercises || exercises.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No exercises scheduled for today. Rest day! 💪</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Today's Workout</span>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {format(new Date(), 'EEEE')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {exercises.slice(0, 3).map((exercise, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{exercise.exercise_name}</h4>
              <Badge className={categoryColors[exercise.category] || 'bg-gray-100 text-gray-700'}>
                {exercise.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercise.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exercise.duration_minutes} min
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="w-4 h-4" />
                {exercise.sets} × {exercise.reps}
              </div>
            </div>
          </motion.div>
        ))}
        
        <Button
          onClick={onStartWorkout}
          className="w-full h-12 mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Workout
        </Button>
      </CardContent>
    </Card>
  );
}