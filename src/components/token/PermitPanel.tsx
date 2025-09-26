'use client';

import { useContext, useState, useEffect } from 'react';
import { StateContext } from '@/app/store';
import { 
  createPermitData, 
  signPermit, 
  executePermit, 
  executePermitTransfer,
  validatePermit,
  getNonce,
  getAllowance,
  isPermitNeeded,
  createDeadline,
  PermitData,
  PermitSignature
} from '@/utils/permitUtils';
import { getTokenInfo } from '@/utils/tokenUtils';
import { shortenAddress } from '@/utils/quaisUtils';

export const PermitPanel = () => {
  const { web3Provider, account } = useContext(StateContext);
  
  // Form state
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState(createDeadline(30));
  const [tokenSymbol, setTokenSymbol] = useState('');
  
  // Permit state
  const [permitData, setPermitData] = useState<PermitData | null>(null);
  const [permitSignature, setPermitSignature] = useState<PermitSignature | null>(null);
  const [currentNonce, setCurrentNonce] = useState<number>(0);
  const [currentAllowance, setCurrentAllowance] = useState<string>('0');
  const [permitNeeded, setPermitNeeded] = useState<boolean>(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'execute' | 'transfer'>('create');

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!web3Provider || !account) return;
      
      try {
        const [tokenInfo, nonce] = await Promise.all([
          getTokenInfo(web3Provider),
          getNonce(web3Provider, account.addr)
        ]);
        
        setTokenSymbol(tokenInfo.symbol);
        setCurrentNonce(nonce);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    };
    
    loadInitialData();
  }, [web3Provider, account]);

  // Check allowance when spender changes
  useEffect(() => {
    const checkAllowance = async () => {
      if (!web3Provider || !account || !spender) return;
      
      try {
        const allowance = await getAllowance(web3Provider, account.addr, spender);
        setCurrentAllowance(allowance);
        
        if (amount) {
          const needed = await isPermitNeeded(web3Provider, account.addr, spender, amount);
          setPermitNeeded(needed);
        }
      } catch (err) {
        console.error('Failed to check allowance:', err);
      }
    };
    
    checkAllowance();
  }, [web3Provider, account, spender, amount]);

  const handleCreatePermit = async () => {
    if (!web3Provider || !account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!spender || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const permitData = await createPermitData(
        web3Provider,
        account.addr,
        spender,
        amount,
        deadline
      );
      
      setPermitData(permitData);
      setSuccess('Permit data created successfully! You can now sign it.');
    } catch (err: any) {
      console.error('Failed to create permit:', err);
      setError(err.message || 'Failed to create permit data');
    } finally {
      setLoading(false);
    }
  };

  const handleSignPermit = async () => {
    if (!web3Provider || !permitData) {
      setError('No permit data available to sign');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const signer = await web3Provider.getSigner();
      const signature = await signPermit(signer, permitData);
      
      setPermitSignature(signature);
      setSuccess('Permit signed successfully! You can now execute it.');
    } catch (err: any) {
      console.error('Failed to sign permit:', err);
      setError(err.message || 'Failed to sign permit');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePermit = async () => {
    if (!web3Provider || !account || !permitSignature || !permitData) {
      setError('Missing required data to execute permit');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const signer = await web3Provider.getSigner();
      const tx = await executePermit(
        signer,
        account.addr,
        spender,
        amount,
        deadline,
        permitSignature.v,
        permitSignature.r,
        permitSignature.s
      );
      
      setSuccess(`Permit executed successfully! Transaction hash: ${shortenAddress(tx.hash)}`);
      
      // Refresh allowance
      const newAllowance = await getAllowance(web3Provider, account.addr, spender);
      setCurrentAllowance(newAllowance);
      setPermitNeeded(false);
    } catch (err: any) {
      console.error('Failed to execute permit:', err);
      setError(err.message || 'Failed to execute permit');
    } finally {
      setLoading(false);
    }
  };

  const handlePermitTransfer = async () => {
    if (!web3Provider || !account || !permitSignature || !permitData) {
      setError('Missing required data to execute permit transfer');
      return;
    }

    const recipient = prompt('Enter recipient address:');
    if (!recipient) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const signer = await web3Provider.getSigner();
      const tx = await executePermitTransfer(
        signer,
        account.addr,
        recipient,
        amount,
        deadline,
        permitSignature.v,
        permitSignature.r,
        permitSignature.s
      );
      
      setSuccess(`Permit transfer executed successfully! Transaction hash: ${shortenAddress(tx.hash)}`);
    } catch (err: any) {
      console.error('Failed to execute permit transfer:', err);
      setError(err.message || 'Failed to execute permit transfer');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-lg font-semibold mb-2">Wallet Required</p>
          <p>Connect your wallet to use permit functionality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
          <span className="text-white text-xl">✍️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Permit Panel
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gasless approvals using EIP-712 signatures
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'create'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Create & Sign
        </button>
        <button
          onClick={() => setActiveTab('execute')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'execute'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Execute Permit
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transfer'
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Permit Transfer
        </button>
      </div>

      {/* Current Status */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Current Status</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Nonce:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200">{currentNonce}</span>
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Allowance:</span>
            <span className="ml-2 text-blue-800 dark:text-blue-200">
              {parseFloat(currentAllowance).toLocaleString()} {tokenSymbol}
            </span>
          </div>
        </div>
        {permitNeeded && (
          <div className="mt-2 text-sm text-orange-600 dark:text-orange-400">
            ⚠️ Current allowance is insufficient for the requested amount
          </div>
        )}
      </div>

      {/* Create & Sign Tab */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Spender Address
            </label>
            <input
              type="text"
              value={spender}
              onChange={(e) => setSpender(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount ({tokenSymbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.000001"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline (Unix timestamp)
            </label>
            <input
              type="number"
              value={deadline}
              onChange={(e) => setDeadline(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Current time: {Math.floor(Date.now() / 1000)}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleCreatePermit}
              disabled={loading || !spender || !amount}
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create Permit Data'}
            </button>
            
            <button
              onClick={handleSignPermit}
              disabled={loading || !permitData}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? 'Signing...' : 'Sign Permit'}
            </button>
          </div>
        </div>
      )}

      {/* Execute Permit Tab */}
      {activeTab === 'execute' && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permit Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Permit Data:</span>
                <span className={permitData ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {permitData ? '✓ Created' : '✗ Not created'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Signature:</span>
                <span className={permitSignature ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {permitSignature ? '✓ Signed' : '✗ Not signed'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleExecutePermit}
            disabled={loading || !permitSignature}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Executing...' : 'Execute Permit'}
          </button>
        </div>
      )}

      {/* Permit Transfer Tab */}
      {activeTab === 'transfer' && (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">Gasless Transfer</p>
            </div>
            <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
              This will transfer tokens using a permit signature without requiring a separate approval transaction.
            </p>
          </div>
          
          <button
            onClick={handlePermitTransfer}
            disabled={loading || !permitSignature}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : 'Execute Permit Transfer'}
          </button>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 dark:text-red-400 font-medium">Error</p>
          </div>
          <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-700 dark:text-green-400 font-medium">Success</p>
          </div>
          <p className="text-green-600 dark:text-green-300 mt-1">{success}</p>
        </div>
      )}
    </div>
  );
};
