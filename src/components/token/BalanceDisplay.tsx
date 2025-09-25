'use client';

import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import { getTokenBalance, getTokenInfo, TokenBalance, TokenInfo } from '@/utils/tokenUtils';
import { shortenAddress } from '@/utils/quaisUtils';

export const BalanceDisplay = () => {
  const { rpcProvider, account } = useContext(StateContext);
  const [balance, setBalance] = useState<TokenBalance | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!rpcProvider || !account) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [balanceData, tokenData] = await Promise.all([
        getTokenBalance(rpcProvider, account.addr),
        getTokenInfo(rpcProvider)
      ]);
      
      setBalance(balanceData);
      setTokenInfo(tokenData);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError('Failed to load token balance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [rpcProvider, account]);

  if (!account) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">👛</span>
          </div>
          <p className="text-lg font-semibold mb-2">Connect Your Wallet</p>
          <p>Connect your wallet to view your token balance</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-red-500 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button
            onClick={fetchBalance}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Balance
        </h2>
        <button
          onClick={fetchBalance}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Refresh balance"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="text-center">
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Wallet Address
          </p>
          <p className="text-lg font-mono text-gray-900 dark:text-white">
            {shortenAddress(account.addr)}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Shard: {account.shard}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Token Balance
          </p>
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {balance ? parseFloat(balance.formatted).toLocaleString() : '0'}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {tokenInfo?.symbol || 'TOKENS'}
          </p>
        </div>

        {balance && parseFloat(balance.formatted) > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center justify-center text-green-600 dark:text-green-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">You have tokens!</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              You can transfer these tokens to other addresses
            </p>
          </div>
        )}

        {balance && parseFloat(balance.formatted) === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-semibold">No tokens yet</span>
            </div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
              Your balance is empty. Ask the owner to mint you some tokens!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
