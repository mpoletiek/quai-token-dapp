'use client';

import { useContext } from 'react';
import { StateContext, DispatchContext } from '@/app/store';
import { requestAccounts } from '@/utils/wallet';

export const ConnectButton = () => {
  const { web3Provider, account } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const connectHandler = () => {
	requestAccounts(dispatch, web3Provider);
  };

  if (!web3Provider) {
	return (
  	<a
    	className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
    	href="https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop"
    	target="_blank"
    	rel="noopener noreferrer"
  	>
    	<span>🔗</span>
    	<span>Install Pelagus</span>
  	</a>
	);
  } else if (account) {
	return (
    	<div className="flex items-center space-x-3">
      	<div className="bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg">
        	<div className="flex items-center space-x-2">
          	<div className="w-2 h-2 bg-green-500 rounded-full"></div>
          	<span className="text-green-700 dark:text-green-300 font-medium text-sm">
            	{account.addr.slice(0, 6)}...{account.addr.slice(-4)}
          	</span>
        	</div>
        	<p className="text-xs text-green-600 dark:text-green-400">
          	{account.shard}
        	</p>
      	</div>
    	</div>
	);
  } else {
	return (
    	<button
      	className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
      	onClick={connectHandler}
    	>
      	<span>🔌</span>
      	<span>Connect Wallet</span>
    	</button>
	);
  }
};