import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, User, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PostCard({ post, currentUser, onLike, onReply, index }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAnonymous, setReplyAnonymous] = useState(false);

  const authorName = post.is_anonymous ? 'Anonymous' : (post.created_by?.split('@')[0] || 'User');
  const authorInitial = post.is_anonymous ? '?' : authorName[0].toUpperCase();

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(post.id, replyText, replyAnonymous);
      setReplyText('');
      setShowReplyInput(false);
      setReplyAnonymous(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          {/* Post Header */}
          <div className="flex items-start gap-3 mb-4">
            <Avatar className={cn(
              "h-10 w-10",
              post.is_anonymous ? "bg-gradient-to-br from-gray-400 to-gray-500" : "bg-gradient-to-br from-emerald-500 to-teal-500"
            )}>
              <AvatarFallback className="text-white font-semibold">
                {authorInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{authorName}</span>
                {post.is_anonymous && (
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    <User className="w-3 h-3 mr-1" />
                    Anonymous
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <p className="text-gray-800 mb-4 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(post.id)}
              className="text-gray-600 hover:text-red-500"
            >
              <Heart className="w-4 h-4 mr-1.5" />
              {post.likes || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-gray-600 hover:text-teal-500"
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              {post.replies?.length || 0}
            </Button>
          </div>

          {/* Replies */}
          {post.replies && post.replies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
              {post.replies.map((reply, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Avatar className={cn(
                    "h-7 w-7",
                    reply.is_anonymous ? "bg-gray-300" : "bg-gradient-to-br from-teal-400 to-indigo-400"
                  )}>
                    <AvatarFallback className="text-white text-xs">
                      {reply.is_anonymous ? '?' : (reply.author_name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {reply.is_anonymous ? 'Anonymous' : reply.author_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-4 pl-4 border-l-2 border-teal-200">
              <div className="flex gap-2 mb-2">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitReply()}
                />
                <Button
                  size="icon"
                  onClick={handleSubmitReply}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={replyAnonymous}
                  onChange={(e) => setReplyAnonymous(e.target.checked)}
                  className="rounded"
                />
                Reply anonymously
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}