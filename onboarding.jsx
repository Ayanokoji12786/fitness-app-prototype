import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '../utils';
import { Loader2 } from 'lucide-react';
import WelcomeStep from '../components/onboarding/WelcomeStep';
import BasicInfoStep from '../components/onboarding/BasicInfoStep';
import MetricsStep from '../components/onboarding/MetricsStep';
import GoalsStep from '../components/onboarding/GoalsStep';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Check if user already has a profile
        const profiles = await base44.entities.UserProfile.filter({ created_by: currentUser.email });
        if (profiles.length > 0 && profiles[0].onboarding_completed) {
          navigate(createPageUrl('Dashboard'));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate(createPageUrl('Home'));
      }
    };
    checkUser();
  }, [navigate]);

  const handleUpdateData = (data) => {
    setFormData({ ...formData, ...data });
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    
    try {
      // Generate AI analysis
      const aiAnalysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze these body metrics and provide scores and recommendations:
        
Body Type: ${formData.body_type}
Age: ${formData.age}, Height: ${formData.height}cm, Weight: ${formData.weight}kg
Chest: ${formData.chest}cm, Waist: ${formData.waist}cm, Hips: ${formData.hips}cm
Arms: ${formData.arms}cm, Legs: ${formData.legs}cm, Shoulders: ${formData.shoulder_width}cm
Posture Notes: ${formData.posture_notes || 'None'}
Fitness Goal: ${formData.fitness_goal}

Based on these metrics, provide:
1. Posture score (0-100) - consider body measurements symmetry and notes
2. Body symmetry score (0-100) - analyze left-right balance from measurements
3. Recommended workout intensity (beginner, intermediate, or advanced)
4. Brief reasoning for each score`,
        response_json_schema: {
          type: 'object',
          properties: {
            posture_score: { type: 'number' },
            symmetry_score: { type: 'number' },
            workout_intensity: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            reasoning: { type: 'string' }
          }
        }
      });

      // Save user profile with AI scores
      const profileData = {
        ...formData,
        posture_score: aiAnalysis.posture_score,
        symmetry_score: aiAnalysis.symmetry_score,
        workout_intensity: aiAnalysis.workout_intensity,
        onboarding_completed: true
      };

      const existingProfiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      if (existingProfiles.length > 0) {
        await base44.entities.UserProfile.update(existingProfiles[0].id, profileData);
      } else {
        await base44.entities.UserProfile.create(profileData);
      }

      // Generate workout plan
      const workoutPlan = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a personalized ${formData.fitness_goal.replace(/_/g, ' ')} workout plan for:
        
Intensity: ${aiAnalysis.workout_intensity}
Body Type: ${formData.body_type}
Goal: ${formData.fitness_goal}
Age: ${formData.age}

Generate a 4-week workout plan with exercises for each day of the week (Monday to Sunday).
Include a mix of exercises appropriate for their goal and intensity level.
For each exercise include: name, description, duration in minutes, sets, reps, category (cardio/strength/flexibility/balance).`,
        response_json_schema: {
          type: 'object',
          properties: {
            plan_name: { type: 'string' },
            exercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: { type: 'string' },
                  exercise_name: { type: 'string' },
                  description: { type: 'string' },
                  duration_minutes: { type: 'number' },
                  sets: { type: 'number' },
                  reps: { type: 'number' },
                  category: { type: 'string' }
                }
              }
            }
          }
        }
      });

      // After successful completion and plan generation, navigate to the Dashboard
      navigate(createPageUrl('Dashboard'));

    } catch (error) {
      console.error('Onboarding completion failed:', error);
      // Optionally show an error message to the user
      setIsProcessing(false);
    }
  };
  
  // Array of components for each step
  const steps = [
    <WelcomeStep onNext={() => setCurrentStep(1)} />,
    <BasicInfoStep onNext={(data) => { handleUpdateData(data); setCurrentStep(2); }} onBack={() => setCurrentStep(0)} />,
    <MetricsStep onNext={(data) => { handleUpdateData(data); setCurrentStep(3); }} onBack={() => setCurrentStep(1)} />,
    <GoalsStep 
      onComplete={handleComplete} 
      onBack={() => setCurrentStep(2)} 
      onUpdateData={handleUpdateData}
      isProcessing={isProcessing}
    />
  ];

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Onboarding 🚀
        </h1>
        {steps[currentStep]}
      </div>
    </div>
  );
}