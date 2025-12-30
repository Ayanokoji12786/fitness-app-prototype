import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Home, Dumbbell, ClipboardList, Users, Settings, BarChart3, Apple } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: 'Home', path: 'Dashboard', icon: Home },
    { name: 'Workout', path: 'WorkoutPlan', icon: Dumbbell },
    { name: 'Nutrition', path: 'Nutrition', icon: Apple },
    { name: 'Analytics', path: 'Analytics', icon: BarChart3 },
    { name: 'Settings', path: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
      <style>{`
        :root {
          --cosmic-gradient: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
          --glass-cosmic: rgba(139, 92, 246, 0.15);
          --glass-border: rgba(167, 139, 250, 0.3);
          --shadow-cosmic: 0 8px 32px rgba(139, 92, 246, 0.3);
          --shadow-cosmic-hover: 0 12px 48px rgba(139, 92, 246, 0.5);
        }
        
        .gradient-cosmic {
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-cosmic {
          background: rgba(139, 92, 246, 0.1);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 139, 250, 0.25);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        
        .glass-cosmic-strong {
          background: rgba(139, 92, 246, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(167, 139, 250, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Cosmic background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20">
        {children}
      </div>

      {/* Bottom Navigation - Glassmorphism */}
      <nav className="fixed bottom-0 left-0 right-0 glass-cosmic-strong border-t border-purple-400/30 safe-area-inset-bottom z-50">
        <div className="max-w-screen-xl mx-auto px-2">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPageName === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative",
                    isActive 
                      ? "text-cyan-300" 
                      : "text-purple-200/70 hover:text-purple-200"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-t-xl" />
                  )}
                  <Icon 
                    className={cn(
                      "mb-1 transition-all relative z-10",
                      isActive ? "h-6 w-6 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "h-5 w-5"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={cn(
                    "text-xs relative z-10 transition-all",
                    isActive ? "font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.6)]" : "font-medium"
                  )}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-t-full shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}