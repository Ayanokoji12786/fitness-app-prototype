import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Target, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomeStep({ onNext }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent" />
      
      {/* Animated stars */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6922bc8c3eed3185124c24e3/a35b0f790_Screenshot2025-11-29at32201PM.png"
            alt="FitFlow Logo"
            className="w-72 h-auto drop-shadow-2xl"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg"
        >
          Welcome to Your Fitness Journey
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-purple-100 mb-12 max-w-md leading-relaxed font-medium"
        >
          Your personal AI-powered cosmic fitness companion
        </motion.p>

        <div className="grid gap-6 mb-12 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-start gap-4 p-5 rounded-2xl glass-cosmic border border-purple-400/30 backdrop-blur-xl"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 border border-cyan-400/50">
              <Target className="w-6 h-6 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white mb-1 drop-shadow-lg">Personalized Plans</h3>
              <p className="text-sm text-purple-200">AI-generated workouts based on your unique metrics</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex items-start gap-4 p-5 rounded-2xl glass-cosmic border border-purple-400/30 backdrop-blur-xl"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/30 to-pink-600/30 border border-pink-400/50">
              <TrendingUp className="w-6 h-6 text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white mb-1 drop-shadow-lg">Track Progress</h3>
              <p className="text-sm text-purple-200">Monitor your cosmic journey to peak fitness</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="flex items-start gap-4 p-5 rounded-2xl glass-cosmic border border-purple-400/30 backdrop-blur-xl"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-400/50">
              <Zap className="w-6 h-6 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white mb-1 drop-shadow-lg">AI-Powered Analysis</h3>
              <p className="text-sm text-purple-200">Smart recommendations from advanced algorithms</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="w-full max-w-md"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="w-full h-16 text-lg font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:shadow-[0_0_40px_rgba(139,92,246,0.8)] transition-all border-2 border-purple-400/50"
          >
            <Sparkles className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Begin Your Journey
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}