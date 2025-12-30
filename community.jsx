import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Users, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PostCard from '../components/community/PostCard';

export default function Community() {
  const [user, setUser] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
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

  const { data: posts, isLoading } = useQuery({
    queryKey: ['communityPosts'],
    queryFn: async () => {
      return await base44.entities.CommunityPost.list('-created_date', 50);
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  const createPostMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.CommunityPost.create({
        content: postContent,
        is_anonymous: isAnonymous,
        likes: 0,
        replies: []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts']);
      setPostContent('');
      setIsAnonymous(false);
      setShowCreatePost(false);
      toast.success('Post created!');
    }
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      const post = posts.find(p => p.id === postId);
      return await base44.entities.CommunityPost.update(postId, {
        likes: (post.likes || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts']);
    }
  });

  const replyPostMutation = useMutation({
    mutationFn: async ({ postId, replyContent, isAnonymous }) => {
      const post = posts.find(p => p.id === postId);
      const newReply = {
        author_email: user.email,
        author_name: user.full_name || user.email.split('@')[0],
        content: replyContent,
        timestamp: new Date().toISOString(),
        is_anonymous: isAnonymous
      };
      
      return await base44.entities.CommunityPost.update(postId, {
        replies: [...(post.replies || []), newReply]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts']);
      toast.success('Reply posted!');
    }
  });

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Community</h1>
          </div>
          <p className="text-purple-50">Share your journey, inspire others</p>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-4">
        {/* Create Post Button */}
        {!showCreatePost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              onClick={() => setShowCreatePost(true)}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Share Your Thoughts
            </Button>
          </motion.div>
        )}

        {/* Create Post Form */}
        <AnimatePresence>
          {showCreatePost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Create a Post</h3>
                  <Textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share your progress, ask questions, or motivate others..."
                    className="min-h-32 mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      Post anonymously
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreatePost(false);
                          setPostContent('');
                          setIsAnonymous(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => createPostMutation.mutate()}
                        disabled={!postContent.trim() || createPostMutation.isPending}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500"
                      >
                        {createPostMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Post'
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={user}
                index={index}
                onLike={(postId) => likePostMutation.mutate(postId)}
                onReply={(postId, content, isAnon) => 
                  replyPostMutation.mutate({ postId, replyContent: content, isAnonymous: isAnon })
                }
              />
            ))
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No posts yet. Be the first to share!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}