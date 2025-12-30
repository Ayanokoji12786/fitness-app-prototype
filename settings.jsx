import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Target, Award, LogOut, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    const getUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (mounted) setUser(currentUser || null);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };
    getUser();
    return () => {
      mounted = false;
    };
  }, []);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError
  } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const profiles = await base44.entities.UserProfile.filter({ created_by: user.email });
      return profiles?.[0] ?? null;
    },
    enabled: !!user?.email,
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (profile) {
      setProfileData((prev) => ({ ...prev, ...profile }));
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await base44.entities.UserProfile.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile', user?.email]);
      toast.success('Profile updated!');
    },
    onError: (err) => {
      console.error('Update failed', err);
      toast.error('Failed to update profile');
    }
  });

  const handleSave = () => {
    if (!profile?.id) {
      toast.error('No profile to update');
      return;
    }
    updateProfileMutation.mutate({ id: profile.id, data: profileData });
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-6 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-gray-300">Manage your profile and preferences</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-600">Name</Label>
                <p className="text-lg font-medium text-gray-900">{user?.full_name ?? '—'}</p>
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="text-lg font-medium text-gray-900">{user?.email ?? '—'}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your AI Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isProfileError || !profile ? (
                <p className="text-sm text-gray-600">No assessment available.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
                    <p className="text-sm text-gray-600 mb-2">Posture Score</p>
                    <p className="text-4xl font-bold gradient-text">{profile?.posture_score ?? '—'}</p>
                    <p className="text-xs text-gray-500 mt-1">/ 100</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-indigo-50">
                    <p className="text-sm text-gray-600 mb-2">Symmetry Score</p>
                    <p className="text-4xl font-bold gradient-text">{profile?.symmetry_score ?? '—'}</p>
                    <p className="text-xs text-gray-500 mt-1">/ 100</p>
                  </div>
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
                    <p className="text-sm text-gray-600 mb-2">Intensity Level</p>
                    <Badge className="text-base px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500">
                      {profile?.workout_intensity ?? '—'}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData?.age ?? ''}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value ? Number(e.target.value) : '' })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="body_type">Body Type</Label>
                  <Select value={profileData?.body_type ?? ''} onValueChange={(value) => setProfileData({ ...profileData, body_type: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ectomorph">Ectomorph</SelectItem>
                      <SelectItem value="mesomorph">Mesomorph</SelectItem>
                      <SelectItem value="endomorph">Endomorph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profileData?.height ?? ''}
                    onChange={(e) => setProfileData({ ...profileData, height: e.target.value ? Number(e.target.value) : '' })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profileData?.weight ?? ''}
                    onChange={(e) => setProfileData({ ...profileData, weight: e.target.value ? Number(e.target.value) : '' })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <Button onClick={handleSave} disabled={updateProfileMutation.isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
                {updateProfileMutation.isError && <p className="text-sm text-red-500">Failed to save changes.</p>}
                {updateProfileMutation.isSuccess && <p className="text-sm text-green-600">Saved.</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
