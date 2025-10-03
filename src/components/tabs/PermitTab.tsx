'use client';
import { PermitPanel } from '@/components/token';

export function PermitTab() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Permit Functionality
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Use EIP-712 signatures for gasless token approvals and transfers. 
          This allows you to approve tokens without paying gas fees.
        </p>
      </div>
      
      <PermitPanel />
    </div>
  );
}
