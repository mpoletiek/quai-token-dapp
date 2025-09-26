/* eslint-disable @typescript-eslint/no-explicit-any */

import { quais } from 'quais';
import { DEPLOYED_CONTRACT } from './constants';
import TokenJson from '../../artifacts/contracts/TestToken.sol/TestToken.json';

// Contract ABI
const TOKEN_ABI = TokenJson.abi;

// EIP-712 Permit type hash
const PERMIT_TYPEHASH = '0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9';

export interface PermitParams {
  owner: string;
  spender: string;
  value: string;
  nonce: string;
  deadline: string;
}

export interface PermitSignature {
  v: number;
  r: string;
  s: string;
}

export interface PermitData {
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
  };
  types: {
    Permit: Array<{
      name: string;
      type: string;
    }>;
  };
  primaryType: string;
  message: PermitParams;
}

// Get contract instance
export const getTokenContract = (provider: any, signer?: any) => {
  const contractAddress = DEPLOYED_CONTRACT;
  if (!contractAddress) {
    throw new Error('Contract address not found');
  }
  
  if (signer) {
    return new quais.Contract(contractAddress, TOKEN_ABI, signer);
  }
  return new quais.Contract(contractAddress, TOKEN_ABI, provider);
};

// Get token name for EIP-712 domain
export const getTokenName = async (provider: any): Promise<string> => {
  try {
    const contract = getTokenContract(provider);
    return await contract.name();
  } catch (error) {
    console.error('Error fetching token name:', error);
    throw error;
  }
};

// Get current nonce for an address
export const getNonce = async (provider: any, address: string): Promise<number> => {
  try {
    const contract = getTokenContract(provider);
    return await contract.getNonce(address);
  } catch (error) {
    console.error('Error fetching nonce:', error);
    throw error;
  }
};

// Get domain separator
export const getDomainSeparator = async (provider: any): Promise<string> => {
  try {
    const contract = getTokenContract(provider);
    return await contract.getDomainSeparator();
  } catch (error) {
    console.error('Error fetching domain separator:', error);
    throw error;
  }
};

// Create EIP-712 domain for permit
export const createPermitDomain = async (provider: any): Promise<any> => {
  try {
    const tokenName = await getTokenName(provider);
    const chainId = await provider.getNetwork().then((network: any) => network.chainId);
    
    return {
      name: tokenName,
      version: '1',
      chainId: chainId,
      verifyingContract: DEPLOYED_CONTRACT
    };
  } catch (error) {
    console.error('Error creating permit domain:', error);
    throw error;
  }
};

// Create permit data for EIP-712 signing
export const createPermitData = async (
  provider: any,
  owner: string,
  spender: string,
  value: string,
  deadline: number
): Promise<PermitData> => {
  try {
    const domain = await createPermitDomain(provider);
    const nonce = await getNonce(provider, owner);
    
    return {
      domain,
      types: {
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      },
      primaryType: 'Permit',
      message: {
        owner,
        spender,
        value,
        nonce: nonce.toString(),
        deadline: deadline.toString()
      }
    };
  } catch (error) {
    console.error('Error creating permit data:', error);
    throw error;
  }
};

// Sign permit using wallet
export const signPermit = async (
  signer: any,
  permitData: PermitData
): Promise<PermitSignature> => {
  try {
    const signature = await signer.signTypedData(
      permitData.domain,
      permitData.types,
      permitData.message
    );
    
    const sig = quais.Signature.from(signature);
    
    return {
      v: sig.v,
      r: sig.r,
      s: sig.s
    };
  } catch (error) {
    console.error('Error signing permit:', error);
    throw error;
  }
};

// Execute permit transaction
export const executePermit = async (
  signer: any,
  owner: string,
  spender: string,
  value: string,
  deadline: number,
  v: number,
  r: string,
  s: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const tx = await contract.permit(owner, spender, value, deadline, v, r, s);
    return await tx.wait();
  } catch (error) {
    console.error('Error executing permit:', error);
    throw error;
  }
};

// Execute gasless transfer using permit
export const executePermitTransfer = async (
  signer: any,
  from: string,
  to: string,
  amount: string,
  deadline: number,
  v: number,
  r: string,
  s: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const tx = await contract.permitTransfer(from, to, amount, deadline, v, r, s);
    return await tx.wait();
  } catch (error) {
    console.error('Error executing permit transfer:', error);
    throw error;
  }
};

// Validate permit signature (basic validation)
export const validatePermit = async (
  provider: any,
  owner: string,
  spender: string,
  value: string,
  deadline: number,
  v: number,
  r: string,
  s: string
): Promise<boolean> => {
  try {
    // Basic validation - check if deadline has passed
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime > deadline) {
      return false;
    }
    
    // Check if owner has sufficient balance
    const contract = getTokenContract(provider);
    const balance = await contract.balanceOf(owner);
    return BigInt(balance.toString()) >= BigInt(value);
  } catch (error) {
    console.error('Error validating permit:', error);
    return false;
  }
};

// Get current allowance
export const getAllowance = async (
  provider: any,
  owner: string,
  spender: string
): Promise<string> => {
  try {
    const contract = getTokenContract(provider);
    const allowance = await contract.allowance(owner, spender);
    return allowance.toString();
  } catch (error) {
    console.error('Error fetching allowance:', error);
    throw error;
  }
};

// Check if permit is needed (allowance is insufficient)
export const isPermitNeeded = async (
  provider: any,
  owner: string,
  spender: string,
  requiredAmount: string
): Promise<boolean> => {
  try {
    const currentAllowance = await getAllowance(provider, owner, spender);
    return BigInt(currentAllowance) < BigInt(requiredAmount);
  } catch (error) {
    console.error('Error checking if permit is needed:', error);
    return true; // Assume permit is needed if we can't check
  }
};

// Utility to create deadline (current time + minutes)
export const createDeadline = (minutesFromNow: number = 30): number => {
  return Math.floor(Date.now() / 1000) + (minutesFromNow * 60);
};

// Format permit data for display
export const formatPermitData = (permitData: PermitData): string => {
  return JSON.stringify(permitData, null, 2);
};

// Parse permit signature from hex string
export const parsePermitSignature = (signature: string): PermitSignature => {
  const sig = quais.Signature.from(signature);
  return {
    v: sig.v,
    r: sig.r,
    s: sig.s
  };
};

// Convert permit signature to hex string
export const permitSignatureToHex = (signature: PermitSignature): string => {
  return quais.Signature.from({ v: signature.v, r: signature.r, s: signature.s }).serialized;
};
