'use client';

import { useState } from 'react';
import { Button } from '../DemoComponents';
import { getBadgeIcon, getBadgeColor } from '@/lib/badges';

interface Comment {
  id: string;
  author: {
    username: string;
    walletAddress: string;
  };
  content: string;
  createdAt: string;
  badges: string[];
  replies?: Comment[];
}

interface NestedCommentProps {
  comment: Comment;
  depth?: number;
}

const NESTING_COLORS = [
  'border-[#0052FF]',
  'border-cyan-400',
  'border-emerald-500',
  'border-lime-500',
  'border-amber-400',
  'border-orange-500',
  'border-rose-500',
  'border-fuchsia-500',
  'border-violet-500',
  'border-indigo-500',
  'border-sky-500',
  'border-blue-500',
  'border-[#0052FF]',
];

export default function NestedComment({ comment, depth = 0 }: NestedCommentProps) {
  const [showReplies, setShowReplies] = useState(true);
  const nestingColor = NESTING_COLORS[depth % NESTING_COLORS.length];
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="mb-4">
      <div className={`pl-4 border-l-2 ${nestingColor}`}>
        <div className="flex items-start gap-3 p-4 bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-sm border border-[var(--app-card-border)]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {comment.author.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-[var(--app-foreground)]">
                {comment.author.username}
              </span>
              {comment.badges.map((badge) => (
                <span
                  key={badge}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                >
                  {getBadgeIcon(badge, 12)}
                  <span className="ml-1 capitalize">{badge}</span>
                </span>
              ))}
              <span className="text-xs text-[var(--app-foreground-muted)]">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[var(--app-foreground)] mb-3">{comment.content}</p>
            <div className="flex items-center gap-4">
              <Button size="sm" variant="secondary">
                👍 0
              </Button>
              <Button size="sm" variant="secondary">
                👎 0
              </Button>
              <Button size="sm" variant="ghost" onClick={() => {}}>
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {hasReplies && showReplies && (
        <div className="mt-2">
          {comment.replies?.map((reply) => (
            <NestedComment key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
      
      {hasReplies && (
        <div className="mt-2 pl-4">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs"
          >
            {showReplies ? '▲ Hide replies' : `▼ Show ${comment.replies?.length} replies`}
          </Button>
        </div>
      )}
    </div>
  );
}