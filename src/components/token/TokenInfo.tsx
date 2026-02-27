'use client';

import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import { getTokenInfo, TokenInfo, formatTokenAmount, isContractPaused } from '@/utils/tokenUtils';
import { DEPLOYED_CONTRACT, BLOCKEXPLORER_URL } from '@/utils/constants';
import { shortenAddress } from '@/utils/quaisUtils';

export const TokenInfoComponent = () => {
  const { rpcProvider } = useContext(StateContext);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DEPLOYED_CONTRACT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = DEPLOYED_CONTRACT;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const fetchTokenInfo = async () => {
      if (!rpcProvider) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [info, pauseStatus] = await Promise.all([
          getTokenInfo(rpcProvider),
          isContractPaused(rpcProvider)
        ]);
        setTokenInfo(info);
        setIsPaused(pauseStatus);
      } catch (err) {
        console.error('Failed to fetch token info:', err);
        setError('Failed to load token information');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenInfo();
  }, [rpcProvider]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">⚠️ Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-gray-500 text-center">
          <p>No token information available</p>
        </div>
      </div>
    );
  }

  const formatSupply = (supply: string, decimals: number) => {
    const formatted = formatTokenAmount(supply, decimals);
    return parseFloat(formatted).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Token Information
          </h2>
          {/* Pause Status Indicator */}
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isPaused
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {isPaused ? '⏸️ PAUSED' : '▶️ ACTIVE'}
            </span>
          </div>
        </div>
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {tokenInfo.symbol.charAt(0)}
          </span>
        </div>
      </div>

      {/* Contract Address */}
      <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Contract Address
        </label>
        <div className="flex items-center gap-2">
          <a
            href={`${BLOCKEXPLORER_URL}/address/${DEPLOYED_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
          >
            {shortenAddress(DEPLOYED_CONTRACT)}
          </a>
          <button
            onClick={handleCopyAddress}
            className="flex-shrink-0 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Copy address"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Token Name
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {tokenInfo.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Symbol
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {tokenInfo.symbol}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Decimals
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {tokenInfo.decimals}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Supply
            </label>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatSupply(tokenInfo.totalSupply, tokenInfo.decimals)} {tokenInfo.symbol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
