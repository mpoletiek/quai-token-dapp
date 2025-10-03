'use client';
import { useContext, useEffect, useState } from 'react';
import { StateContext } from '@/app/store';
import { quais } from 'quais';
import TokenJson from '../../artifacts/contracts/TestTokenV2.sol/TestTokenV2.json';
import { DEPLOYED_CONTRACT } from '@/utils/constants';

export function useIsOwner() {
  const { account, rpcProvider } = useContext(StateContext);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOwner = async () => {
      if (!account || !rpcProvider) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      try {
        const contract = new quais.Contract(DEPLOYED_CONTRACT, TokenJson.abi, rpcProvider);
        const owner = await contract.owner();
        const isOwnerResult = owner.toLowerCase() === account.addr.toLowerCase();
        setIsOwner(isOwnerResult);
      } catch (error) {
        console.error('Error checking contract owner:', error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwner();
  }, [account, rpcProvider]);

  return { isOwner, loading };
}
