'use client';
import { StateProvider } from '@/app/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
	<>
    	<StateProvider>
        	{children}
    	</StateProvider>

	</>
  );
}