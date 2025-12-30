import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2, Sparkles, Stars, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const isAuthenticated = await base44.auth.isAuthenticated();
        
        if (!isAuthenticated) {
          base44.auth.redirectToLogin(window.location.pathname);
          return;
        }

        const currentUser = await base44.auth.me();
        
        // Check if user has completed onboarding
        const profiles = await base44.entities.UserProfile.filter({ 
          created_by: currentUser.email 
        });
        
        if (profiles.length === 0 || !profiles[0].onboarding_completed) {
          navigate(createPageUrl('Onboarding'));
        } else {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        console.error('Auth check error:', error);
        base44.auth.redirectToLogin(window.location.pathname);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        {/* Cosmic background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent" />
        
        {/* Animated stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
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
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1 }}
          className="relative z-10"
        >
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6922bc8c3eed3185124c24e3/a35b0f790_Screenshot2025-11-29at32201PM.png"
            alt="FitFlow Logo"
            className="w-72 h-auto mb-8 drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" strokeWidth={2.5} />
            <p className="text-xl text-purple-200 font-medium">Initializing Cosmic Training</p>
          </div>
          <p className="text-purple-300/80">Preparing your personalized experience...</p>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: -10,
              }}
              animate={{
                y: [-10, -window.innerHeight - 10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}