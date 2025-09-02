import { notFound } from 'next/navigation';
import { getStorie } from '@/lib/supabase/queries';
import NestedComment from '@/app/components/comments/NestedComment';
import { PutOnChainButton } from '@/app/components/comments/PutOnChainButton';

export default async function StoriePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const Storie = await getStorie(id);
  
  if (!Storie) {
    notFound();
  }

  // Mock comment data - replace with real data in production
  const comments = [
    {
      id: '1',
      author: {
        username: 'CryptoFan',
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      content: 'This is an amazing forecast! Can\'t wait to see how it plays out.',
      createdAt: new Date().toISOString(),
      badges: ['director', 'superfan'],
      replies: [
        {
          id: '2',
          author: {
            username: 'MarketGuru',
            walletAddress: '0x8765432109876543210987654321098765432109',
          },
          content: 'I agree! The technical indicators are looking strong for this prediction.',
          createdAt: new Date().toISOString(),
          badges: ['guionista', 'hacker'],
        }
      ]
    },
    {
      id: '3',
      author: {
        username: 'Skeptic',
        walletAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      },
      content: 'I\'m not so sure about this forecast. The market conditions seem volatile.',
      createdAt: new Date().toISOString(),
      badges: ['spamero'],
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--app-background)]">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Main Storie Card */}
        <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[var(--app-foreground)] mb-4">
              {Storie.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#0052FF] to-[#00D4FF] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {Storie.author.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--app-foreground-muted)]">
                <span>Storieed by</span>
                <span className="font-medium text-[var(--app-foreground)]">
                  {Storie.author.username}
                </span>
                <span>•</span>
                <span>
                  {new Date(Storie.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="prose max-w-none text-[var(--app-foreground)] leading-relaxed">
              {Storie.content}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--app-foreground)]">
              Comments ({comments.length})
            </h2>
            <div className="text-sm text-[var(--app-foreground-muted)]">
              Sort by: Latest
            </div>
          </div>
          
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <NestedComment key={comment.id} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--app-foreground-muted)]">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">No comments yet</h3>
              <p>Be the first to share your thoughts on this Storie!</p>
            </div>
          )}
        </div>

        {/* Admin Action */}
        <PutOnChainButton 
          StorieId={id} 
          threadTitle={Storie.title} 
        />

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-[var(--app-card-border)]">
          <button 
            onClick={() => window.history.back()}
            className="text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] font-medium transition-colors"
          >
            ← Back to Stories
          </button>
        </div>
      </div>
    </div>
  );
}