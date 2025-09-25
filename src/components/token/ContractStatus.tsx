'use client';

import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import { checkContractExists, DEPLOYED_CONTRACT } from '@/utils/tokenUtils';

export const ContractStatus = () => {
  const { rpcProvider } = useContext(StateContext);
  const [contractExists, setContractExists] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkContract = async () => {
      if (!rpcProvider) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const exists = await checkContractExists(rpcProvider);
        setContractExists(exists);
      } catch (err: any) {
        console.error('Error checking contract:', err);
        setError(err.message || 'Failed to check contract status');
      } finally {
        setLoading(false);
      }
    };

    checkContract();
  }, [rpcProvider]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Contract Status
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Contract Address
          </label>
          <p className="text-lg font-mono text-gray-900 dark:text-white break-all">
            {DEPLOYED_CONTRACT || 'Not set'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Contract Status
          </label>
          <div className="flex items-center space-x-2">
            {contractExists === null ? (
              <span className="text-gray-500">Unknown</span>
            ) : contractExists ? (
              <>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  Contract Found
                </span>
              </>
            ) : (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  Contract Not Found
                </span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-400 font-medium">Error</p>
            </div>
            <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
          </div>
        )}

        {!DEPLOYED_CONTRACT && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-yellow-700 dark:text-yellow-400 font-medium">Configuration Required</p>
                <p className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                  Please set the NEXT_PUBLIC_DEPLOYED_CONTRACT environment variable with your deployed contract address.
                </p>
              </div>
            </div>
          </div>
        )}

        {DEPLOYED_CONTRACT && contractExists === false && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-red-700 dark:text-red-400 font-medium">Contract Not Found</p>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                  No contract found at the specified address. Please verify:
                </p>
                <ul className="text-red-600 dark:text-red-300 text-sm mt-2 ml-4 list-disc">
                  <li>The contract address is correct</li>
                  <li>The contract has been deployed to the current network</li>
                  <li>You're connected to the correct RPC endpoint</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-medium text-sm">Setup Instructions</p>
              <ol className="text-blue-600 dark:text-blue-300 text-sm mt-1 space-y-1 list-decimal list-inside">
                <li>Create a <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">.env.local</code> file in your project root</li>
                <li>Add <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">NEXT_PUBLIC_DEPLOYED_CONTRACT=your_contract_address</code></li>
                <li>Deploy your contract using <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npx hardhat run scripts/deployToken.js --network cyprus1</code></li>
                <li>Copy the deployed address to your environment variable</li>
                <li>Restart your development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

