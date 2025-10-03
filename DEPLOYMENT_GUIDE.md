# Upgradeable Token Deployment Guide

This guide explains how to deploy and manage the upgradeable TestToken contract using the transparent proxy pattern.

## Prerequisites

1. **Environment Setup**: Ensure your `.env` file contains the required variables:
   ```env
   # Network Configuration
   NEXT_PUBLIC_RPC_URL=your_rpc_url
   NEXT_PUBLIC_CHAIN_ID=your_chain_id
   CYPRUS1_PK=your_private_key
   CYPRUS1_ADDRESS=your_wallet_address

   # Token Configuration
   TOKEN_NAME=Test Token
   TOKEN_SYMBOL=TEST
   TOKEN_INITIAL_SUPPLY=1000000
   TOKEN_MAX_SUPPLY=10000000
   INITIAL_OWNER=your_wallet_address

   # V2 Upgrade Configuration
   V2_TOKEN_MAX_SUPPLY=20000000
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install
   ```

## Deployment Scripts

### 1. Initial Deployment (`initialProxyDeploy.js`)

Deploys the complete upgradeable token setup in the most efficient way possible:

**What it does:**
- Deploys the TestToken implementation contract
- Deploys the ProxyAdmin contract
- Encodes initialization data
- Deploys the Transparent Upgradeable Proxy with initialization
- Verifies the deployment

**Usage:**
```bash
# Deploy to cyprus1 network
npm run deploy:proxy

# Deploy to cyprus1_fullpath network
npm run deploy:proxy:fullpath
```

**Output:**
After successful deployment, you'll get:
- Implementation contract address
- ProxyAdmin contract address  
- Transparent Proxy address (use this for all interactions)

**Important:** Save the deployment addresses to your `.env` file:
```env
PROXY_ADMIN_ADDRESS=0x...
PROXY_ADDRESS=0x...
```

### 2. Token Upgrade (`upgradeToken.js`)

Upgrades the token implementation to a new version (currently upgrades to TestTokenV2):

**Prerequisites:**
- Must have `PROXY_ADMIN_ADDRESS` and `PROXY_ADDRESS` in `.env`
- Must be the owner of the ProxyAdmin contract

**Usage:**
```bash
# Upgrade on cyprus1 network
npm run upgrade:token

# Upgrade on cyprus1_fullpath network  
npm run upgrade:token:fullpath
```

**What it does:**
- Deploys new TestTokenV2 implementation contract
- Encodes reinitializer call with new max supply from V2_TOKEN_MAX_SUPPLY
- Calls ProxyAdmin to upgrade the proxy with reinitializer data
- Verifies the upgrade was successful
- Shows V2-specific features (version, whitelist status, updated max supply)

### 3. V2 Feature Testing (`testV2Features.js`)

Tests the new V2 features after upgrading to TestTokenV2:

**Prerequisites:**
- Must have `PROXY_ADDRESS` in `.env`
- Contract must be upgraded to V2

**Usage:**
```bash
# Test V2 features on cyprus1 network
npm run test:v2

# Test V2 features on cyprus1_fullpath network
npm run test:v2:fullpath
```

**What it tests:**
- Version identification
- Blacklist functionality (add/remove addresses)
- Whitelist functionality (add/remove addresses)
- Whitelist toggle (enable/disable)
- Existing functionality preservation

### 4. Deployment Verification (`verifyDeployment.js`)

Verifies the current state of your deployed contracts:

**Prerequisites:**
- Must have `PROXY_ADMIN_ADDRESS` and `PROXY_ADDRESS` in `.env`

**Usage:**
```bash
# Verify on cyprus1 network
npm run verify:deployment

# Verify on cyprus1_fullpath network
npm run verify:deployment:fullpath
```

**What it checks:**
- ProxyAdmin ownership and configuration
- Transparent Proxy admin relationship
- Token implementation state
- ERC20 functionality
- Permit functionality

## Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   ProxyAdmin    │    │ TransparentProxy │    │ Implementation  │
│                 │    │                  │    │   (TestToken)   │
│ - Manages       │◄───┤ - Forwards calls │◄───┤ - Contains      │
│   upgrades      │    │   to impl        │    │   logic         │
│ - Owner only    │    │ - Stores state   │    │ - Stateless     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Concepts

### Transparent Proxy Pattern
- **Admin calls**: Go to the proxy (for upgrades)
- **User calls**: Go to the implementation (for token functions)
- **State**: Stored in the proxy contract
- **Logic**: Stored in the implementation contract

### Upgrade Process
1. Deploy new implementation contract
2. Call ProxyAdmin.upgradeAndCall() with new implementation
3. Proxy now points to new implementation
4. All existing state is preserved

### V2 Features (TestTokenV2)
The V2 upgrade adds compliance features:

**Blacklist Functionality:**
- `setBlacklisted(address, bool)` - Add/remove addresses from blacklist
- `batchSetBlacklisted(address[], bool)` - Batch blacklist operations
- `isBlacklisted(address)` - Check if address is blacklisted
- Blacklisted addresses cannot send or receive tokens

**Whitelist Functionality:**
- `setWhitelisted(address, bool)` - Add/remove addresses from whitelist
- `batchSetWhitelisted(address[], bool)` - Batch whitelist operations
- `isWhitelisted(address)` - Check if address is whitelisted
- `setWhitelistEnabled(bool)` - Enable/disable whitelist mode
- When enabled, only whitelisted addresses can transfer tokens

**Version Identification:**
- `version()` - Returns "2.0.0" to identify V2 contract

**Reinitializer Functionality:**
- `initializeV2(uint256 _newSupply)` - Updates max supply during upgrade
- Uses `reinitializer(2)` modifier for safe reinitialization
- Called automatically during upgrade process
- Allows updating storage variables without breaking existing state

### Security Considerations
- Only ProxyAdmin owner can upgrade
- Implementation contracts should be stateless
- Always verify upgrades before production use
- Keep implementation addresses for future upgrades

## Troubleshooting

### Common Issues

1. **"Missing environment variables"**
   - Ensure all required variables are in `.env`
   - Check variable names match exactly

2. **"Insufficient funds"**
   - Ensure wallet has enough QUAI for gas fees
   - Check network configuration

3. **"Not owner"**
   - Ensure you're using the correct private key
   - Verify you're the owner of the ProxyAdmin

4. **"Already initialized"**
   - Implementation can only be initialized once
   - Use the proxy address for interactions

### Verification Steps

1. **Check contract addresses** in your `.env` file
2. **Run verification script** to confirm deployment
3. **Test basic functions** like name(), symbol(), balanceOf()
4. **Verify ownership** of ProxyAdmin contract

## Best Practices

1. **Save deployment addresses** immediately after deployment
2. **Test upgrades** on testnet before mainnet
3. **Verify contracts** after each deployment/upgrade
4. **Keep implementation addresses** for future upgrades
5. **Use proxy address** for all token interactions
6. **Monitor gas costs** during deployment and upgrades

## Complete Upgrade Workflow

Here's the complete process to deploy and upgrade your token:

### Initial Deployment
```bash
# 1. Deploy initial V1 contract
npm run deploy:proxy

# 2. Save addresses to .env file
# PROXY_ADMIN_ADDRESS=0x...
# PROXY_ADDRESS=0x...

# 3. Verify deployment
npm run verify:deployment
```

### Upgrade to V2
```bash
# 1. Upgrade to V2
npm run upgrade:token

# 2. Test V2 features
npm run test:v2

# 3. Verify upgrade
npm run verify:deployment
```

## Example Usage

### V1 Usage
```javascript
// After deployment, interact with the token via proxy
const token = new quais.Contract(
  PROXY_ADDRESS,           // Use proxy address
  TestTokenJson.abi,       // V1 Token ABI
  wallet
);

// All calls go through the proxy to implementation
const name = await token.name();
const balance = await token.balanceOf(userAddress);
await token.mint(userAddress, amount);
```

### V2 Usage
```javascript
// After upgrade, interact with V2 features
const tokenV2 = new quais.Contract(
  PROXY_ADDRESS,           // Same proxy address
  TestTokenV2Json.abi,     // V2 Token ABI
  wallet
);

// V2 features
const version = await tokenV2.version(); // "2.0.0"
await tokenV2.setBlacklisted(address, true);
await tokenV2.setWhitelisted(address, true);
await tokenV2.setWhitelistEnabled(true);
```

## Support

For issues or questions:
1. Check the verification script output
2. Review contract addresses in `.env`
3. Ensure network configuration is correct
4. Verify wallet has sufficient funds
