/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import {
  burnTokens,
  isContractOwner,
  getTokenInfo,
  isValidAmount,
  isContractPaused,
  pauseContract,
  unpauseContract
} from '@/utils/tokenUtils';
import { shortenAddress } from '@/utils/quaisUtils';

export const OwnerPanel = () => {
  const { web3Provider, account } = useContext(StateContext);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  
  // Burn form state
  const [burnAmount, setBurnAmount] = useState('');
  const [burnLoading, setBurnLoading] = useState(false);
  const [burnError, setBurnError] = useState<string | null>(null);
  const [burnSuccess, setBurnSuccess] = useState<string | null>(null);
  
  // Pause/unpause state
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseError, setPauseError] = useState<string | null>(null);
  const [pauseSuccess, setPauseSuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!web3Provider || !account) {
        setLoading(false);
        return;
      }

      try {
        const [ownerStatus, tokenInfo, pauseStatus] = await Promise.all([
          isContractOwner(web3Provider, account.addr),
          getTokenInfo(web3Provider),
          isContractPaused(web3Provider)
        ]);
        
        setIsOwner(ownerStatus);
        setTokenSymbol(tokenInfo.symbol);
        setIsPaused(pauseStatus);
      } catch (err) {
        console.error('Failed to check ownership:', err);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [web3Provider, account]);

  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!web3Provider || !account) {
      setBurnError('Please connect your wallet first');
      return;
    }

    if (!isValidAmount(burnAmount)) {
      setBurnError('Please enter a valid amount');
      return;
    }

    try {
      setBurnLoading(true);
      setBurnError(null);
      setBurnSuccess(null);

      const tx = await burnTokens(await web3Provider.getSigner(), burnAmount);
      
      setBurnSuccess(`Burn successful! Transaction hash: ${shortenAddress(tx.hash)}`);
      setBurnAmount('');
    } catch (err: any) {
      console.error('Burn failed:', err);
      setBurnError(err.message || 'Burn failed. Please try again.');
    } finally {
      setBurnLoading(false);
    }
  };

  const handlePause = async () => {
    if (!web3Provider || !account) {
      setPauseError('Please connect your wallet first');
      return;
    }

    try {
      setPauseLoading(true);
      setPauseError(null);
      setPauseSuccess(null);

      const tx = await pauseContract(await web3Provider.getSigner());
      
      setPauseSuccess(`Contract paused! Transaction hash: ${shortenAddress(tx.hash)}`);
      setIsPaused(true);
    } catch (err: any) {
      console.error('Pause failed:', err);
      setPauseError(err.message || 'Pause failed. Please try again.');
    } finally {
      setPauseLoading(false);
    }
  };

  const handleUnpause = async () => {
    if (!web3Provider || !account) {
      setPauseError('Please connect your wallet first');
      return;
    }

    try {
      setPauseLoading(true);
      setPauseError(null);
      setPauseSuccess(null);

      const tx = await unpauseContract(await web3Provider.getSigner());
      
      setPauseSuccess(`Contract unpaused! Transaction hash: ${shortenAddress(tx.hash)}`);
      setIsPaused(false);
    } catch (err: any) {
      console.error('Unpause failed:', err);
      setPauseError(err.message || 'Unpause failed. Please try again.');
    } finally {
      setPauseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-lg font-semibold mb-2">Wallet Required</p>
          <p>Connect your wallet to access owner functions</p>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <span className="text-2xl">👑</span>
          </div>
          <p className="text-lg font-semibold mb-2">Owner Access Required</p>
          <p>Only the contract owner can access these functions</p>
          <p className="text-sm mt-2">Your address: {shortenAddress(account.addr)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-xl">👑</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Owner Panel
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contract owner functions
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Burn Tokens */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 dark:text-red-400 text-sm">-</span>
            </span>
            Burn Owned Tokens
          </h3>
          
          <form onSubmit={handleBurn} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount to Burn ({tokenSymbol})
              </label>
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={burnLoading}
              />
            </div>
            
            {burnError && (
              <div className="text-red-500 text-sm">{burnError}</div>
            )}
            
            {burnSuccess && (
              <div className="text-green-500 text-sm">{burnSuccess}</div>
            )}
            
            <button
              type="submit"
              disabled={burnLoading || !burnAmount}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {burnLoading ? 'Burning...' : 'Burn Tokens'}
            </button>
          </form>
        </div>

        {/* Pause/Unpause Contract */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-orange-600 dark:text-orange-400 text-sm">⏸️</span>
            </span>
            Contract Control
          </h3>
          
          {/* Pause Status Display */}
          <div className="mb-4 p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Status:
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                isPaused 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {isPaused ? '⏸️ PAUSED' : '▶️ ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isPaused 
                ? 'All transfers, minting, burning, and permit functions are disabled'
                : 'Contract is fully operational'
              }
            </p>
          </div>
          
          {/* Pause/Unpause Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePause}
              disabled={pauseLoading || isPaused}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {pauseLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Pausing...
                </>
              ) : (
                '⏸️ Pause Contract'
              )}
            </button>
            
            <button
              onClick={handleUnpause}
              disabled={pauseLoading || !isPaused}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {pauseLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Unpausing...
                </>
              ) : (
                '▶️ Unpause Contract'
              )}
            </button>
          </div>
          
          {pauseError && (
            <div className="mt-3 text-red-500 text-sm">{pauseError}</div>
          )}
          
          {pauseSuccess && (
            <div className="mt-3 text-green-500 text-sm">{pauseSuccess}</div>
          )}
        </div>
      </div>
    </div>
  );
};
