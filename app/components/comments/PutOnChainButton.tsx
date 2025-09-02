'use client';

import { useState } from 'react';
import { Button } from '../DemoComponents';
import { useAccount, useWriteContract, useSwitchChain } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { DiscussionStorage } from '@/lib/contracts';
import { useWalletSync } from '@/lib/hooks/useWalletSync';

interface PutOnChainButtonProps {
  StorieId: string;
  threadTitle: string;
}

export function PutOnChainButton({ StorieId, threadTitle }: PutOnChainButtonProps) {
  const [status, setStatus] = useState('');
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, isSuccess, isError } = useWriteContract();
  const { isAdmin, isLoading: walletSyncLoading } = useWalletSync();

  // Don't show button if not admin or still checking
  if (walletSyncLoading) {
    return (
      <div className="mt-4 p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">
        🔐 Checking admin permissions...
      </div>
    );
  }

  if (!isAdmin) {
    console.log('Not showing PutOnChainButton - user is not admin');
    return null;
  }

  const handleArchiveThread = async () => {
    if (!address) {
      setStatus('Please connect your wallet first');
      return;
    }

    // Check if we're on the correct network
    if (chain?.id !== baseSepolia.id) {
      try {
        setStatus('Switching to Base Sepolia network...');
        await switchChain({ chainId: baseSepolia.id });
      } catch {
        setStatus('Failed to switch to Base Sepolia network');
        return;
      }
    }

    try {
      setStatus('Processing transaction...');
      
      const discussion = new DiscussionStorage();
      const config = discussion.getCreateStorieConfig(
        threadTitle,
        'Thread archived on-chain',
        JSON.stringify({ 
          originalStorieId: StorieId,
          archivedBy: address,
          archivedAt: new Date().toISOString()
        })
      );

      writeContract(config);
      
    } catch (err) {
      console.error('Archive failed:', err);
      const error = err as Error;
      setStatus(`Error: ${error.message || 'Failed to store thread on-chain'}`);
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <Button
        onClick={handleArchiveThread}
        disabled={isPending}
        variant="primary"
        className="w-full bg-gradient-to-r from-[#0052FF] to-[#00D4FF] hover:from-[#0041CC] hover:to-[#00B8E6] text-white font-medium shadow-lg"
      >
        {isPending ? (
          <span className="flex items-center justify-center">
            <span className="mr-2">Processing...</span>
            <span className="animate-spin">●</span>
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">💾</span>
            Store Full Thread On-Chain
          </span>
        )}
      </Button>
      
      {/* Status messages based on transaction state */}
      {isPending && !status && (
        <div className="p-3 rounded-lg text-sm bg-blue-50 text-blue-700 border border-blue-200">
          Transaction pending...
        </div>
      )}
      
      {isSuccess && (
        <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
          Thread stored on-chain successfully! 🎉
        </div>
      )}
      
      {isError && (
        <div className="p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          Transaction failed. Please try again.
        </div>
      )}

      {status && !isPending && !isSuccess && !isError && (
        <div className={`p-3 rounded-lg text-sm ${
          status.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}