/* eslint-disable @typescript-eslint/no-explicit-any */

import { quais } from 'quais';
import TokenJson from '../../artifacts/contracts/TestToken.sol/TestToken.json';
import { DEPLOYED_CONTRACT } from './constants';

// Contract ABI
const TOKEN_ABI = TokenJson.abi;

// Contract interface
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  maxSupply: string;
  totalMinted: string;
}

export interface TokenBalance {
  balance: string;
  formatted: string;
}

// Get contract instance
export const getTokenContract = (provider: any, signer?: any) => {
  const contractAddress = DEPLOYED_CONTRACT;
  if (!contractAddress) {
    throw new Error('Contract address not found. Please set NEXT_PUBLIC_DEPLOYED_CONTRACT environment variable.');
  }
  
  if (!quais.isAddress(contractAddress)) {
    throw new Error(`Invalid contract address: ${contractAddress}`);
  }
  
  console.log('Using contract address:', contractAddress);
  
  if (signer) {
    return new quais.Contract(contractAddress, TOKEN_ABI, signer);
  }
  return new quais.Contract(contractAddress, TOKEN_ABI, provider);
};

// Get token information
export const getTokenInfo = async (provider: any): Promise<TokenInfo> => {
  try {
    // First check if contract exists
    const contractExists = await checkContractExists(provider);
    if (!contractExists) {
      throw new Error('Contract does not exist at the specified address. Please check your NEXT_PUBLIC_DEPLOYED_CONTRACT environment variable.');
    }
    
    const contract = getTokenContract(provider);
    
    const [name, symbol, decimals, totalSupply, maxSupply, totalMinted] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
      contract.maxSupply(),
      contract.totalMinted()
    ]);

    return {
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: totalSupply.toString(),
      maxSupply: maxSupply.toString(),
      totalMinted: totalMinted.toString()
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    throw error;
  }
};

// Get user token balance
export const getTokenBalance = async (provider: any, address: string): Promise<TokenBalance> => {
  try {
    // First check if contract exists
    const contractExists = await checkContractExists(provider);
    if (!contractExists) {
      throw new Error('Contract does not exist at the specified address. Please check your NEXT_PUBLIC_DEPLOYED_CONTRACT environment variable.');
    }
    
    const contract = getTokenContract(provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    
    return {
      balance: balance.toString(),
      formatted: quais.formatUnits(balance, decimals)
    };
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
};

// Transfer tokens
export const transferTokens = async (
  signer: any,
  to: string,
  amount: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const decimals = await contract.decimals();
    const amountWei = quais.parseUnits(amount, decimals);
    
    const tx = await contract.transfer(to, amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
};

// Mint tokens (owner only)
export const mintTokens = async (
  signer: any,
  to: string,
  amount: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const decimals = await contract.decimals();
    const amountWei = quais.parseUnits(amount, decimals);
    
    const tx = await contract.mint(to, amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
};

// Burn tokens (owner only)
export const burnTokens = async (
  signer: any,
  amount: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const decimals = await contract.decimals();
    const amountWei = quais.parseUnits(amount, decimals);
    
    const tx = await contract.burn(amountWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error burning tokens:', error);
    throw error;
  }
};

// Update max supply (owner only)
export const updateMaxSupply = async (
  signer: any,
  newMaxSupply: string
): Promise<any> => {
  try {
    const contract = getTokenContract(signer, signer);
    const newMaxSupplyWei = quais.parseUnits(newMaxSupply, 18); // Assuming 18 decimals for max supply
    
    const tx = await contract.updateMaxSupply(newMaxSupplyWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error updating max supply:', error);
    throw error;
  }
};

// Check if contract exists at the given address
export const checkContractExists = async (provider: any): Promise<boolean> => {
  try {
    const contractAddress = DEPLOYED_CONTRACT;
    if (!contractAddress || !quais.isAddress(contractAddress)) {
      return false;
    }
    
    const code = await provider.getCode(contractAddress);
    return code !== '0x';
  } catch (error) {
    console.error('Error checking contract existence:', error);
    return false;
  }
};

// Check if address is contract owner
export const isContractOwner = async (provider: any, address: string): Promise<boolean> => {
  try {
    // First check if contract exists
    const contractExists = await checkContractExists(provider);
    if (!contractExists) {
      console.error('Contract does not exist at the specified address');
      return false;
    }
    
    const contract = getTokenContract(provider);
    const owner = await contract.owner();
    
    if (!owner || owner === '0x0000000000000000000000000000000000000000') {
      console.error('Contract owner is not set or is zero address');
      return false;
    }
    
    return owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error checking contract owner:', error);
    return false;
  }
};

// Format token amount for display
export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    return quais.formatUnits(amount, decimals);
  } catch (error) {
    return '0';
  }
};

// Validate address
export const isValidAddress = (address: string): boolean => {
  return quais.isAddress(address);
};

// Validate amount
export const isValidAmount = (amount: string): boolean => {
  try {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0;
  } catch {
    return false;
  }
};
