'use client';
import { useState, useEffect, useContext } from 'react';
import { StateContext } from '@/app/store';
import { getContractVersion } from '@/utils/tokenUtils';

export function VersionInfo() {
  const { rpcProvider } = useContext(StateContext);
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVersion = async () => {
      if (!rpcProvider) {
        setLoading(false);
        return;
      }

      try {
        const contractVersion = await getContractVersion(rpcProvider);
        setVersion(contractVersion);
      } catch (error) {
        console.error('Error loading contract version:', error);
        setVersion('Unknown');
      } finally {
        setLoading(false);
      }
    };

    loadVersion();
  }, [rpcProvider]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Loading version...</span>
        </div>
      </div>
    );
  }

  const isV2 = version === '2.0.0';

  return (
    <div className={`rounded-lg shadow-lg p-4 ${
      isV2 
        ? 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800' 
        : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white">
            Contract Version
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {version || 'Unknown'}
          </p>
        </div>
        <div className="flex items-center">
          {isV2 ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                V2 Features Available
              </span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                V1 Contract
              </span>
            </div>
          )}
        </div>
      </div>
      
      {isV2 && (
        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-md">
          <p className="text-sm text-green-800 dark:text-green-200">
            ✨ This contract supports blacklist/whitelist functionality and other V2 features!
          </p>
        </div>
      )}
    </div>
  );
}
