'use client';

import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import { 
  mintTokens, 
  burnTokens, 
  updateMaxSupply, 
  isContractOwner, 
  getTokenInfo, 
  isValidAddress, 
  isValidAmount 
} from '@/utils/tokenUtils';
import { shortenAddress } from '@/utils/quaisUtils';

export const OwnerPanel = () => {
  const { web3Provider, account } = useContext(StateContext);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenSymbol, setTokenSymbol] = useState('');
  
  // Mint form state
  const [mintRecipient, setMintRecipient] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [mintLoading, setMintLoading] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState<string | null>(null);
  
  // Burn form state
  const [burnAmount, setBurnAmount] = useState('');
  const [burnLoading, setBurnLoading] = useState(false);
  const [burnError, setBurnError] = useState<string | null>(null);
  const [burnSuccess, setBurnSuccess] = useState<string | null>(null);
  
  // Max supply form state
  const [newMaxSupply, setNewMaxSupply] = useState('');
  const [maxSupplyLoading, setMaxSupplyLoading] = useState(false);
  const [maxSupplyError, setMaxSupplyError] = useState<string | null>(null);
  const [maxSupplySuccess, setMaxSupplySuccess] = useState<string | null>(null);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!web3Provider || !account) {
        setLoading(false);
        return;
      }

      try {
        const [ownerStatus, tokenInfo] = await Promise.all([
          isContractOwner(web3Provider, account.addr),
          getTokenInfo(web3Provider)
        ]);
        
        setIsOwner(ownerStatus);
        setTokenSymbol(tokenInfo.symbol);
      } catch (err) {
        console.error('Failed to check ownership:', err);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [web3Provider, account]);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!web3Provider || !account) {
      setMintError('Please connect your wallet first');
      return;
    }

    if (!isValidAddress(mintRecipient)) {
      setMintError('Please enter a valid recipient address');
      return;
    }

    if (!isValidAmount(mintAmount)) {
      setMintError('Please enter a valid amount');
      return;
    }

    try {
      setMintLoading(true);
      setMintError(null);
      setMintSuccess(null);

      const tx = await mintTokens(await web3Provider.getSigner(), mintRecipient, mintAmount);
      
      setMintSuccess(`Mint successful! Transaction hash: ${shortenAddress(tx.hash)}`);
      setMintRecipient('');
      setMintAmount('');
    } catch (err: any) {
      console.error('Mint failed:', err);
      setMintError(err.message || 'Mint failed. Please try again.');
    } finally {
      setMintLoading(false);
    }
  };

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

  const handleUpdateMaxSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!web3Provider || !account) {
      setMaxSupplyError('Please connect your wallet first');
      return;
    }

    if (!isValidAmount(newMaxSupply)) {
      setMaxSupplyError('Please enter a valid amount');
      return;
    }

    try {
      setMaxSupplyLoading(true);
      setMaxSupplyError(null);
      setMaxSupplySuccess(null);

      const tx = await updateMaxSupply(await web3Provider.getSigner(), newMaxSupply);
      
      setMaxSupplySuccess(`Max supply updated! Transaction hash: ${shortenAddress(tx.hash)}`);
      setNewMaxSupply('');
    } catch (err: any) {
      console.error('Update max supply failed:', err);
      setMaxSupplyError(err.message || 'Update failed. Please try again.');
    } finally {
      setMaxSupplyLoading(false);
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
        {/* Mint Tokens */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 dark:text-green-400 text-sm">+</span>
            </span>
            Mint Tokens
          </h3>
          
          <form onSubmit={handleMint} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={mintRecipient}
                onChange={(e) => setMintRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={mintLoading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount ({tokenSymbol})
              </label>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={mintLoading}
              />
            </div>
            
            {mintError && (
              <div className="text-red-500 text-sm">{mintError}</div>
            )}
            
            {mintSuccess && (
              <div className="text-green-500 text-sm">{mintSuccess}</div>
            )}
            
            <button
              type="submit"
              disabled={mintLoading || !mintRecipient || !mintAmount}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {mintLoading ? 'Minting...' : 'Mint Tokens'}
            </button>
          </form>
        </div>

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

        {/* Update Max Supply */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 dark:text-blue-400 text-sm">⚙️</span>
            </span>
            Update Max Supply
          </h3>
          
          <form onSubmit={handleUpdateMaxSupply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Max Supply ({tokenSymbol})
              </label>
              <input
                type="number"
                value={newMaxSupply}
                onChange={(e) => setNewMaxSupply(e.target.value)}
                placeholder="0.0"
                step="0.000001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={maxSupplyLoading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Set to 0 for unlimited supply
              </p>
            </div>
            
            {maxSupplyError && (
              <div className="text-red-500 text-sm">{maxSupplyError}</div>
            )}
            
            {maxSupplySuccess && (
              <div className="text-green-500 text-sm">{maxSupplySuccess}</div>
            )}
            
            <button
              type="submit"
              disabled={maxSupplyLoading || !newMaxSupply}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {maxSupplyLoading ? 'Updating...' : 'Update Max Supply'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
