'use client';
import { OwnerPanel, BlacklistWhitelistPanel } from '@/components/token';

export function OwnerTab() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Owner Controls
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Contract owner functionality for minting, burning, pausing, and managing token supply. 
          These features are only available to the contract owner.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <OwnerPanel />
        <BlacklistWhitelistPanel />
      </div>
    </div>
  );
}
