"use client";

import { type ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { PutOnChainButton } from "./comments/PutOnChainButton";
import { getBadgeIcon, getBadgeColor } from "@/lib/badges";
import { getStorie as getPost, getStorieComments as getPostComments, createComment, getStories as getPosts, createStorie as createPost, type Storie as Post, type Comment } from "@/lib/supabase/queries";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Minimalistic and beautiful UI design
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Responsive layout for all devices
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Dark mode support
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              OnchainKit integration
            </span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({ setActiveTab }: HomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <div className="text-center mb-6">
          <img 
            src="https://nard-chat.onrender.com/assets/nard-chat-logo.png" 
            alt="Nard.chat Logo" 
            className="h-86 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-[var(--app-foreground)] mb-2">Nard.chat</h2>
          <p className="text-sm font-medium text-blue-400">DECENTRALIZED NARRATIVES</p>
        </div>
        <p className="text-[var(--app-foreground-muted)] mb-4 text-center">
          Decentralized mini-app for creating and sharing narratives on Sepolia Base
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={() => setActiveTab("posts")}
            icon={<Icon name="heart" size="sm" />}
          >
            View Stories & Create
          </Button>
        </div>
      </Card>

    </div>
  );
}

type IconProps = {
  name: "heart" | "star" | "check" | "plus" | "arrow-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}





type PostsDemoProps = {
  setActiveTab: (tab: string) => void;
  onSelectPost: (postId: string) => void;
};

export function PostsDemo({ setActiveTab, onSelectPost }: PostsDemoProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isCreating, setIsCreating] = useState(false);
  const { address } = useAccount();

  // Load posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const postsData = await getPosts(10, 0);
        setPosts(postsData);
      } catch (err) {
        console.error('Error loading posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !address) return;

    setIsCreating(true);
    try {
      const post = await createPost(
        newPost.title.trim(),
        newPost.content.trim(),
        address,
        `User${address.slice(-4)}` // Generate username from wallet
      );

      if (post) {
        // Add new post to the list
        setPosts(prev => [post, ...prev]);
        setNewPost({ title: '', content: '' });
        setShowCreateForm(false);
      } else {
        setError('Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Stories & Comments">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Here you can see the stories and nested comments system we&apos;ve built.
        </p>
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() => setShowCreateForm(true)}
            variant="primary"
          >
            Create New Story
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("home")}>
            Back to Home
          </Button>
        </div>
      </Card>

      {/* Create Post Form */}
      {showCreateForm && (
        <Card title="Create New Story">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                placeholder="Enter story title..."
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                placeholder="Write your story content..."
                rows={4}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleCreatePost}
                variant="primary"
                disabled={isCreating || !address || !newPost.title.trim() || !newPost.content.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Story'}
              </Button>
              <Button
                onClick={() => {
                  setNewPost({ title: '', content: '' });
                  setShowCreateForm(false);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Posts List */}
      <Card title="Recent Stories">
        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)]"></div>
            <span className="ml-2 text-[var(--app-foreground-muted)]">Loading stories...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center p-8 text-[var(--app-foreground-muted)]">
                No stories yet. Create the first one!
              </div>
            ) : (
              posts.map((post) => (
            <div 
              key={post.id}
              className="p-4 rounded-lg border border-[var(--app-card-border)] hover:bg-[var(--app-accent-light)] cursor-pointer transition-colors"
              onClick={() => onSelectPost(post.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-[var(--app-foreground)]">{post.author.username}</div>
                  <div className="text-xs text-[var(--app-foreground-muted)]">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
                {post.title}
              </h3>
              <p className="text-[var(--app-foreground-muted)] text-sm line-clamp-2">
                {post.content}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-[var(--app-foreground-muted)]">
                <span>👤 {post.author.username}</span>
                <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            </div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* Features Overview */}
      <Card title="What We've Built">
        <ul className="space-y-3">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              <strong>Nested Comments:</strong> Full hierarchical comment system with colored nesting
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              <strong>Badge System:</strong> 10 custom badges with icons and colors
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              <strong>Smart Contract:</strong> Real Base Sepolia integration for archiving stories
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              <strong>Admin Controls:</strong> PutOnChainButton only visible to admin wallet
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

type PostViewProps = {
  postId: string;
  onBack: () => void;
};

export function PostView({ postId, onBack }: PostViewProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { address } = useAccount();

  // Load post and comments
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [postData, commentsData] = await Promise.all([
          getPost(postId),
          getPostComments(postId)
        ]);
        
        if (!postData) {
          setError('Post not found');
          return;
        }
        
        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load post data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !address || !post) return;

    setIsSubmittingComment(true);
    try {
      const comment = await createComment(
        postId, 
        newComment.trim(),
        address,
        `User${address.slice(-4)}` // Generate username from wallet
      );

      if (comment) {
        // Reload comments to get proper nested structure
        const updatedComments = await getPostComments(postId);
        setComments(updatedComments);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back to Posts
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-[var(--app-foreground-muted)]">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back to Posts
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-[var(--app-foreground-muted)]">{error || 'Post not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Posts
        </Button>
      </div>

      {/* Main Post Card */}
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--app-foreground-muted)]">
              <span>Posted by</span>
              <span className="font-medium text-[var(--app-foreground)]">
                {post.author.username}
              </span>
              <span>•</span>
              <span>
                {formatDate(post.created_at)}
              </span>
            </div>
          </div>
          {post.author.badges && post.author.badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.author.badges.map((badge, index) => (
                <span 
                  key={index}
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                >
                  {getBadgeIcon(badge, 12)}
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          )}
          <div className="prose max-w-none text-[var(--app-foreground)] leading-relaxed">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Admin Put On Chain Button */}
          <PutOnChainButton 
            StorieId={postId} 
            threadTitle={post.title} 
          />
        </div>
      </Card>

      {/* Add Comment Form */}
      {address && (
        <Card title="Add a comment">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--app-foreground)] mb-2">
                Content
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-accent)] resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSubmitComment}
                variant="primary"
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--app-foreground)]">
              Comments ({comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)})
            </h2>
          </div>
          
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* Main Comment */}
                  <div className="border-l-4 border-[#0052FF] pl-4">
                    <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {comment.author.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[var(--app-foreground)]">
                              {comment.author.username}
                            </span>
                            {comment.author.badges && comment.author.badges.map((badge, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                              >
                                {getBadgeIcon(badge, 10)}
                                <span>{badge}</span>
                              </span>
                            ))}
                            <span className="text-xs text-[var(--app-foreground-muted)]">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-[var(--app-foreground)] mb-3 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-[var(--app-foreground-muted)]">
                              👍 {comment.upvotes} 👎 {comment.downvotes}
                            </span>
                            <span className="text-[var(--app-foreground-muted)]">
                              Score: {comment.vote_score}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="border-l-4 border-cyan-400 pl-4">
                          <div className="bg-[var(--app-card-bg)] rounded-lg p-4 border border-[var(--app-card-border)]">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {reply.author.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-[var(--app-foreground)]">
                                    {reply.author.username}
                                  </span>
                                  {reply.author.badges && reply.author.badges.map((badge, index) => (
                                    <span
                                      key={index}
                                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                                    >
                                      {getBadgeIcon(badge, 10)}
                                      <span>{badge}</span>
                                    </span>
                                  ))}
                                  <span className="text-xs text-[var(--app-foreground-muted)]">
                                    {formatDate(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-[var(--app-foreground)] mb-3 whitespace-pre-wrap">
                                  {reply.content}
                                </p>
                                <div className="flex items-center gap-3 text-sm">
                                  <span className="text-[var(--app-foreground-muted)]">
                                    👍 {reply.upvotes} 👎 {reply.downvotes}
                                  </span>
                                  <span className="text-[var(--app-foreground-muted)]">
                                    Score: {reply.vote_score}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--app-foreground-muted)]">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">No comments yet</h3>
              <p>Be the first to share your thoughts on this post!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
