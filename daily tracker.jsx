import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, Droplet, Moon, Footprints, CalendarDays, TrendingUp, Save } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function DailyTracker() {
  const [user, setUser] = useState(null);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [steps, setSteps] = useState(0);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    getUser();
  }, []);

  const { data: dailyLog, isLoading } = useQuery({
    queryKey: ['dailyLog', format(new Date(), 'yyyy-MM-dd'), user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const today = format(new Date(), 'yyyy-MM-dd');
      const logs = await base44.entities.DailyLog.filter({ 
        created_by: user.email,
        log_date: today
      });
      return logs[0];
    },
    enabled: !!user?.email,
    staleTime: 10000,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (dailyLog) {
      setWater(dailyLog.water_glasses || 0);
      setSleep(dailyLog.sleep_hours || 0);
      setSteps(dailyLog.steps || 0);
      setNotes(dailyLog.notes || '');
    }
  }, [dailyLog]);

  const saveLogMutation = useMutation({
    mutationFn: async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const logData = {
        log_date: today,
        water_glasses: water,
        sleep_hours: sleep,
        steps: steps,
        notes: notes
      };

      if (dailyLog) {
        return base44.entities.DailyLog.update(dailyLog.id, logData);
      } else {
        return base44.entities.DailyLog.create(logData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dailyLog']);
      toast.success('Daily log saved!');
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const waterProgress = Math.min((water / 8) * 100, 100);
  const sleepProgress = Math.min((sleep / 8) * 100, 100);
  const stepsProgress = Math.min((steps / 10000) * 100, 100);

  const completedExercises = dailyLog?.exercises_completed?.length || 0;

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Daily Tracker</h1>
          </div>
          <p className="text-emerald-50">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg glass-effect">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Progress</p>
                  <p className="text-2xl font-bold gradient-text">
                    {completedExercises} exercises completed
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tracking Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100">
                    <Droplet className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">Water Intake</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{water}</span>
                    <span className="text-gray-600">/ 8 glasses</span>
                  </div>
                  <Progress value={waterProgress} className="h-2" />
                </div>
                <Input
                  type="number"
                  value={water}
                  onChange={(e) => setWater(Math.max(0, Number(e.target.value)))}
                  min="0"
                  className="h-10"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-100">
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <CardTitle className="text-base">Sleep</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{sleep}</span>
                    <span className="text-gray-600">/ 8 hours</span>
                  </div>
                  <Progress value={sleepProgress} className="h-2" />
                </div>
                <Input
                  type="number"
                  value={sleep}
                  onChange={(e) => setSleep(Math.max(0, Number(e.target.value)))}
                  min="0"
                  step="0.5"
                  className="h-10"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100">
                    <Footprints className="w-5 h-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-base">Steps</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{steps.toLocaleString()}</span>
                    <span className="text-gray-600">/ 10k</span>
                  </div>
                  <Progress value={stepsProgress} className="h-2" />
                </div>
                <Input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(Math.max(0, Number(e.target.value)))}
                  min="0"
                  className="h-10"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Daily Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How are you feeling today? Any achievements or challenges?"
                className="min-h-32 mb-4"
              />
              <Button
                onClick={() => saveLogMutation.mutate()}
                disabled={saveLogMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                {saveLogMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Daily Log
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}