/* eslint-disable @typescript-eslint/no-explicit-any */

import { quais } from 'quais';
import TokenJson from '../../artifacts/contracts/TestTokenV2.sol/TestTokenV2.json';
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

// Get contract owner
export const getContractOwner = async (contract: any): Promise<string> => {
  try {
    const owner = await contract.owner();
    return owner;
  } catch (error) {
    console.error('Error fetching contract owner:', error);
    throw error;
  }
};

// Get token information
export const getTokenInfo = async (provider: any): Promise<TokenInfo> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    
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
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
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
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
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
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
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
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
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
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const newMaxSupplyWei = quais.parseUnits(newMaxSupply, 18); // Assuming 18 decimals for max supply
    
    const tx = await contract.updateMaxSupply(newMaxSupplyWei);
    return await tx.wait();
  } catch (error) {
    console.error('Error updating max supply:', error);
    throw error;
  }
};

// Check if address is contract owner
export const isContractOwner = async (provider: any, address: string): Promise<boolean> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    const owner = await contract.owner();
    return owner.toLowerCase() === address.toLowerCase();
  } catch (error) {
    console.error('Error checking contract owner:', error);
    return false;
  }
};

// Check if contract is paused
export const isContractPaused = async (provider: any): Promise<boolean> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    return await contract.paused();
  } catch (error) {
    console.error('Error checking contract pause status:', error);
    return false;
  }
};

// Pause contract (owner only)
export const pauseContract = async (signer: any): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.pause();
    return await tx.wait();
  } catch (error) {
    console.error('Error pausing contract:', error);
    throw error;
  }
};

// Unpause contract (owner only)
export const unpauseContract = async (signer: any): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.unpause();
    return await tx.wait();
  } catch (error) {
    console.error('Error unpausing contract:', error);
    throw error;
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

// ============ V2 BLACKLIST/WHITELIST FUNCTIONALITY ============

// Set blacklist status for an address (owner only)
export const setBlacklisted = async (signer: any, account: string, blacklistStatus: boolean): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.setBlacklisted(account, blacklistStatus);
    return tx;
  } catch (error) {
    console.error('Error setting blacklist status:', error);
    throw error;
  }
};

// Batch set blacklist status for multiple addresses (owner only)
export const batchSetBlacklisted = async (signer: any, accounts: string[], blacklistStatus: boolean): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.batchSetBlacklisted(accounts, blacklistStatus);
    return tx;
  } catch (error) {
    console.error('Error batch setting blacklist status:', error);
    throw error;
  }
};

// Set whitelist status for an address (owner only)
export const setWhitelisted = async (signer: any, account: string, whitelistStatus: boolean): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.setWhitelisted(account, whitelistStatus);
    return tx;
  } catch (error) {
    console.error('Error setting whitelist status:', error);
    throw error;
  }
};

// Batch set whitelist status for multiple addresses (owner only)
export const batchSetWhitelisted = async (signer: any, accounts: string[], whitelistStatus: boolean): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.batchSetWhitelisted(accounts, whitelistStatus);
    return tx;
  } catch (error) {
    console.error('Error batch setting whitelist status:', error);
    throw error;
  }
};

// Enable or disable whitelist feature (owner only)
export const setWhitelistEnabled = async (signer: any, enabled: boolean): Promise<any> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, signer);
    const tx = await contract.setWhitelistEnabled(enabled);
    return tx;
  } catch (error) {
    console.error('Error setting whitelist enabled:', error);
    throw error;
  }
};

// Check if an address is blacklisted
export const isBlacklisted = async (provider: any, account: string): Promise<boolean> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    return await contract.isBlacklisted(account);
  } catch (error) {
    console.error('Error checking blacklist status:', error);
    throw error;
  }
};

// Check if an address is whitelisted
export const isWhitelisted = async (provider: any, account: string): Promise<boolean> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    return await contract.isWhitelisted(account);
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    throw error;
  }
};

// Check if whitelist is enabled
export const isWhitelistEnabled = async (provider: any): Promise<boolean> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    return await contract.isWhitelistEnabled();
  } catch (error) {
    console.error('Error checking whitelist enabled status:', error);
    throw error;
  }
};

// Get contract version
export const getContractVersion = async (provider: any): Promise<string> => {
  try {
    const contract = new quais.Contract(DEPLOYED_CONTRACT, TOKEN_ABI, provider);
    return await contract.version();
  } catch (error) {
    console.error('Error getting contract version:', error);
    throw error;
  }
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
