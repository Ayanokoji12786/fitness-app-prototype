import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Sparkles, RefreshCw, Loader2 } from 'lucide-react';

export default function AIInsightsPanel({ insights, isLoading, onRefresh }) {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'suggestion': return Lightbulb;
      case 'correlation': return Sparkles;
      default: return Lightbulb;
    }
  };

  const getInsightColors = (type) => {
    switch (type) {
      case 'positive': 
        return {
          bg: 'from-emerald-500/20 to-green-500/20',
          border: 'border-emerald-400/50',
          icon: 'text-emerald-300',
          badge: 'bg-emerald-500/30 text-emerald-200'
        };
      case 'warning': 
        return {
          bg: 'from-amber-500/20 to-orange-500/20',
          border: 'border-amber-400/50',
          icon: 'text-amber-300',
          badge: 'bg-amber-500/30 text-amber-200'
        };
      case 'suggestion': 
        return {
          bg: 'from-cyan-500/20 to-blue-500/20',
          border: 'border-cyan-400/50',
          icon: 'text-cyan-300',
          badge: 'bg-cyan-500/30 text-cyan-200'
        };
      case 'correlation': 
        return {
          bg: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-400/50',
          icon: 'text-purple-300',
          badge: 'bg-purple-500/30 text-purple-200'
        };
      default: 
        return {
          bg: 'from-purple-500/20 to-indigo-500/20',
          border: 'border-purple-400/50',
          icon: 'text-purple-300',
          badge: 'bg-purple-500/30 text-purple-200'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-cosmic-strong rounded-3xl p-6 border border-purple-400/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/30 border border-pink-400/50">
            <Brain className="w-6 h-6 text-pink-300 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white drop-shadow-lg">AI Insights</h3>
            <p className="text-sm text-purple-200">Personalized recommendations from your data</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="glass-cosmic border-purple-400/30 text-purple-200 hover:text-white hover:border-cyan-400/50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" />
            <div className="absolute inset-2 bg-gradient-to-br from-purple-900 to-indigo-900 rounded-full flex items-center justify-center">
              <Brain className="w-8 h-8 text-cyan-300 animate-pulse" strokeWidth={2} />
            </div>
          </div>
          <p className="text-purple-200 font-medium">Analyzing your fitness data...</p>
          <p className="text-purple-300/70 text-sm mt-1">Finding patterns and correlations</p>
        </div>
      ) : insights ? (
        <div className="space-y-4">
          {/* Top Recommendation */}
          {insights.topRecommendation && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/30 border border-cyan-400/50">
                  <Sparkles className="w-5 h-5 text-cyan-300" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyan-300 uppercase mb-1">Top Recommendation</p>
                  <p className="text-white font-medium">{insights.topRecommendation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Overall Score */}
          {insights.overallScore && (
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="rgba(139, 92, 246, 0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(insights.overallScore / 100) * 251} 251`}
                      transform="rotate(-90 48 48)"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-3xl font-bold text-white">{insights.overallScore}</span>
                </div>
                <p className="text-purple-200 text-sm mt-2">Overall Health Score</p>
              </div>
            </div>
          )}

          {/* Insights List */}
          <div className="grid gap-3">
            {insights.insights?.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const colors = getInsightColors(insight.type);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${colors.bg} border ${colors.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${colors.badge}`}>
                      <Icon className={`w-4 h-4 ${colors.icon}`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{insight.title}</h4>
                        {insight.metric && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                            {insight.metric}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-purple-100">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 flex items-center justify-center">
            <Brain className="w-8 h-8 text-purple-300" strokeWidth={2} />
          </div>
          <p className="text-purple-200 font-medium mb-2">Not enough data yet</p>
          <p className="text-purple-300/70 text-sm">Log at least 3 days of activity to get AI insights</p>
        </div>
      )}
    </motion.div>
  );
}