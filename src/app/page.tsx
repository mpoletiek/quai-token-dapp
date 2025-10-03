'use client';
import { useContext } from "react";
import { StateContext } from "@/app/store";
import { useGetAccounts } from "@/utils/wallet";
import { ConnectButton } from "@/components/wallet/connectButton";
import { Tabs } from "@/components/ui/Tabs";
import { MainTab, PermitTab, OwnerTab } from "@/components/tabs";
import { useIsOwner } from "@/hooks/useIsOwner";

export default function Home() {
  useGetAccounts();
  const { account } = useContext(StateContext);
  const { isOwner, loading: ownerLoading } = useIsOwner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                TestToken dApp
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to TestToken
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive ERC20 token dApp built on Quai Network. 
            {account ? (
              <span className="block mt-2 text-green-600 dark:text-green-400 font-semibold">
                Connected as {account.addr.slice(0, 6)}...{account.addr.slice(-4)}
                {isOwner && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                    Owner
                  </span>
                )}
              </span>
            ) : (
              <span className="block mt-2 text-blue-600 dark:text-blue-400">
                Connect your wallet to get started
              </span>
            )}
          </p>
        </div>

        {/* Tabbed Interface */}
        <Tabs
          tabs={[
            {
              id: 'main',
              label: 'Main',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              ),
              content: <MainTab />
            },
            {
              id: 'permit',
              label: 'Permit',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              ),
              content: <PermitTab />
            },
            {
              id: 'owner',
              label: 'Owner',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              content: ownerLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">Checking owner status...</span>
                </div>
              ) : isOwner ? (
                <OwnerTab />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Owner Access Required
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This tab is only available to the contract owner.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Connected as: {account?.addr.slice(0, 6)}...{account?.addr.slice(-4)}
                  </p>
                </div>
              ),
              disabled: false
            }
          ]}
          defaultTab="main"
        />

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            Built with Next.js, Quai Network, and OpenZeppelin contracts
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://qu.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              Quai Network
            </a>
            <a 
              href="https://openzeppelin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              OpenZeppelin
            </a>
            <a 
              href="https://nextjs.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              Next.js
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
