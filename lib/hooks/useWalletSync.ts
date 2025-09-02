'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ensureUserExists } from '@/lib/supabase/queries';

interface UserData {
  id: string;
  role: string;
  username: string;
}

export function useWalletSync() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const syncWallet = async () => {
      if (!isConnected || !address) {
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Syncing wallet with database:', address);
        
        // Ensure user exists in database and get their data
        const userData = await ensureUserExists(address);
        
        if (userData) {
          console.log('Wallet sync successful:', userData);
          setUser(userData);
          setIsAdmin(userData.role === 'admin');
        } else {
          console.error('Failed to sync wallet with database');
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error syncing wallet:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    syncWallet();
  }, [address, isConnected]);

  return {
    user,
    isAdmin,
    isLoading,
    isConnected: isConnected && !!user
  };
}