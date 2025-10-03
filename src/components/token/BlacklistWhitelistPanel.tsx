'use client';
import { useState, useEffect, useContext } from 'react';
import { StateContext } from '@/app/store';
import { 
  setBlacklisted, 
  setWhitelisted, 
  setWhitelistEnabled,
  isBlacklisted,
  isWhitelisted,
  isWhitelistEnabled,
  isValidAddress
} from '@/utils/tokenUtils';

export function BlacklistWhitelistPanel() {
  const { account, web3Provider, rpcProvider } = useContext(StateContext);
  
  // State for form inputs
  const [address, setAddress] = useState('');
  const [whitelistEnabled, setWhitelistEnabledState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  
  // State for status checks
  const [blacklistStatus, setBlacklistStatus] = useState<boolean | null>(null);
  const [whitelistStatus, setWhitelistStatus] = useState<boolean | null>(null);
  const [whitelistEnabledStatus, setWhitelistEnabledStatus] = useState<boolean | null>(null);

  // Load initial whitelist enabled status
  useEffect(() => {
    const loadWhitelistStatus = async () => {
      if (!rpcProvider) return;
      
      try {
        const enabled = await isWhitelistEnabled(rpcProvider);
        setWhitelistEnabledStatus(enabled);
      } catch (error) {
        console.error('Error loading whitelist status:', error);
      }
    };

    loadWhitelistStatus();
  }, [rpcProvider]);

  const handleSetBlacklisted = async (blacklistStatus: boolean) => {
    if (!web3Provider || !account || !address) return;
    
    if (!isValidAddress(address)) {
      alert('Please enter a valid address');
      return;
    }

    setLoading(true);
    try {
      const signer = await web3Provider.getSigner();
      const tx = await setBlacklisted(signer, address, blacklistStatus);
      await tx.wait();
      
      alert(`Address ${blacklistStatus ? 'blacklisted' : 'unblacklisted'} successfully!`);
      setAddress('');
      checkStatus();
    } catch (error: any) {
      console.error('Error setting blacklist status:', error);
      alert(`Error: ${error.message || 'Failed to set blacklist status'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetWhitelisted = async (whitelistStatus: boolean) => {
    if (!web3Provider || !account || !address) return;
    
    if (!isValidAddress(address)) {
      alert('Please enter a valid address');
      return;
    }

    setLoading(true);
    try {
      const signer = await web3Provider.getSigner();
      const tx = await setWhitelisted(signer, address, whitelistStatus);
      await tx.wait();
      
      alert(`Address ${whitelistStatus ? 'whitelisted' : 'unwhitelisted'} successfully!`);
      setAddress('');
      checkStatus();
    } catch (error: any) {
      console.error('Error setting whitelist status:', error);
      alert(`Error: ${error.message || 'Failed to set whitelist status'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetWhitelistEnabled = async (enabled: boolean) => {
    if (!web3Provider || !account) return;

    setLoading(true);
    try {
      const signer = await web3Provider.getSigner();
      const tx = await setWhitelistEnabled(signer, enabled);
      await tx.wait();
      
      setWhitelistEnabledStatus(enabled);
      alert(`Whitelist ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error: any) {
      console.error('Error setting whitelist enabled:', error);
      alert(`Error: ${error.message || 'Failed to set whitelist enabled'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!rpcProvider || !address) return;
    
    if (!isValidAddress(address)) {
      alert('Please enter a valid address');
      return;
    }

    setStatusLoading(true);
    try {
      const [blacklisted, whitelisted] = await Promise.all([
        isBlacklisted(rpcProvider, address),
        isWhitelisted(rpcProvider, address)
      ]);
      
      setBlacklistStatus(blacklisted);
      setWhitelistStatus(whitelisted);
    } catch (error: any) {
      console.error('Error checking status:', error);
      alert(`Error: ${error.message || 'Failed to check status'}`);
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Blacklist & Whitelist Management
      </h3>

      {/* Whitelist Toggle */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Whitelist Mode
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              When enabled, only whitelisted addresses can transfer tokens
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Status: {whitelistEnabledStatus === null ? 'Loading...' : whitelistEnabledStatus ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <button
            onClick={() => handleSetWhitelistEnabled(!whitelistEnabledStatus)}
            disabled={loading || whitelistEnabledStatus === null}
            className={`
              px-4 py-2 rounded-md font-medium transition-colors
              ${whitelistEnabledStatus 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
              ${loading || whitelistEnabledStatus === null ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Processing...' : whitelistEnabledStatus ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>

      {/* Address Input */}
      <div className="mb-6">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Status Check */}
      <div className="mb-6">
        <button
          onClick={checkStatus}
          disabled={!address || statusLoading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {statusLoading ? 'Checking...' : 'Check Status'}
        </button>
        
        {/* Status Display */}
        {blacklistStatus !== null && whitelistStatus !== null && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Current Status:</h5>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-20">Blacklist:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  blacklistStatus 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {blacklistStatus ? 'Blacklisted' : 'Not Blacklisted'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300 w-20">Whitelist:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  whitelistStatus 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {whitelistStatus ? 'Whitelisted' : 'Not Whitelisted'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blacklist Actions */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 dark:text-white">Blacklist Actions</h5>
          <button
            onClick={() => handleSetBlacklisted(true)}
            disabled={!address || loading}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Blacklist Address'}
          </button>
          <button
            onClick={() => handleSetBlacklisted(false)}
            disabled={!address || loading}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Remove from Blacklist'}
          </button>
        </div>

        {/* Whitelist Actions */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 dark:text-white">Whitelist Actions</h5>
          <button
            onClick={() => handleSetWhitelisted(true)}
            disabled={!address || loading}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Whitelist Address'}
          </button>
          <button
            onClick={() => handleSetWhitelisted(false)}
            disabled={!address || loading}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Remove from Whitelist'}
          </button>
        </div>
      </div>

      {/* Information */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h5 className="font-medium text-blue-900 dark:text-blue-200 mb-2">How it works:</h5>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• <strong>Blacklisted addresses</strong> cannot send or receive tokens</li>
          <li>• <strong>Whitelist mode</strong> restricts transfers to whitelisted addresses only</li>
          <li>• <strong>Whitelisted addresses</strong> can transfer tokens when whitelist mode is enabled</li>
          <li>• These features help with compliance and security</li>
        </ul>
      </div>
    </div>
  );
}
