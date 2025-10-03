# TestToken dApp - Upgradeable ERC20 with V2 Features

A comprehensive decentralized application (dApp) for interacting with upgradeable ERC20 tokens on the Quai Network. This project demonstrates modern Web3 development practices with a full-featured token management interface, including advanced Permit standard (EIP-2612) support, upgradeable smart contracts, and V2 compliance features.

![TestToken dApp](https://img.shields.io/badge/TestToken-dApp-blue)
![Quai Network](https://img.shields.io/badge/Network-Quai-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![EIP-2612](https://img.shields.io/badge/EIP--2612-Permit-orange)
![Upgradeable](https://img.shields.io/badge/Upgradeable-Proxy-purple)
![V2 Features](https://img.shields.io/badge/V2-Compliance-green)

## 🚀 Features

### Core Functionality
- **Token Information Display**: View token metadata, supply statistics, and minting progress
- **Balance Management**: Check and refresh token balances with real-time updates
- **Token Transfers**: Send tokens to any address with validation and transaction feedback
- **Owner Controls**: Mint new tokens, burn existing tokens, and manage supply limits (owner only)
- **Contract Pausability**: Pause/unpause contract operations for emergency control (owner only)
- **Wallet Integration**: Connect with Pelagus wallet for Quai Network

### 🆕 Advanced Features
- **Permit Standard (EIP-2612)**: Gasless approvals using EIP-712 signatures
- **Gasless Transfers**: Execute token transfers without separate approval transactions
- **Batch Permits**: Set multiple allowances with a single transaction
- **Signature Management**: Create, sign, and execute permit signatures
- **Meta-Transactions**: Support for third-party gas payment
- **Nonce Management**: Automatic nonce tracking for replay attack prevention

### 🔄 Upgradeable Contract System
- **Transparent Proxy Pattern**: Upgradeable smart contracts with state preservation
- **Proxy Admin**: Secure upgrade management with owner-only access
- **Reinitializer Support**: Safe contract upgrades with new initialization data
- **Version Detection**: Automatic contract version identification
- **State Preservation**: All existing balances and settings maintained during upgrades

### 🛡️ V2 Compliance Features
- **Blacklist Management**: Add/remove addresses from blacklist (owner only)
- **Whitelist Management**: Add/remove addresses from whitelist (owner only)
- **Whitelist Mode**: Restrict transfers to whitelisted addresses only
- **Compliance Ready**: Built-in features for regulatory compliance
- **Batch Operations**: Support for batch blacklist/whitelist operations

### User Experience
- **Modern UI**: Clean, responsive design with dark mode support
- **Tabbed Interface**: Organized functionality with Main, Permit, and Owner tabs
- **Role-Based Access**: Owner-only features with automatic detection
- **Real-time Updates**: Live balance and transaction status updates
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Smooth loading indicators for all operations
- **Mobile Responsive**: Optimized for all device sizes
- **Version Awareness**: Visual indicators for V2 feature availability

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Blockchain**: Quai Network, Quais.js SDK
- **Smart Contracts**: Solidity 0.8.22+, OpenZeppelin contracts (ERC20, ERC20Permit, ERC20Pausable, Upgradeable)
- **Proxy Pattern**: Transparent Upgradeable Proxy with ProxyAdmin
- **Wallet**: Pelagus wallet integration
- **Build Tools**: Hardhat (with viaIR compilation), ESLint, PostCSS
- **Standards**: EIP-2612 (Permit), EIP-712 (Typed Data Signing), EIP-1967 (Proxy Storage)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Pelagus Wallet](https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop) (for Quai Network)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mpoletiek/quai-token-dapp.git
cd quai-token-dapp
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Quai Network Configuration
NEXT_PUBLIC_RPC_URL=https://orchard.rpc.quai.network
NEXT_PUBLIC_EXPLORER_URL=https://orchard.quaiscan.io
NEXT_PUBLIC_CHAIN_ID=0x00
CYPRUS1_PK=your_private_key_here
CYPRUS1_ADDRESS=your_wallet_address

# Token Configuration
TOKEN_NAME=TestToken
TOKEN_SYMBOL=TEST
TOKEN_INITIAL_SUPPLY=1000000
TOKEN_MAX_SUPPLY=10000000
INITIAL_OWNER=your_wallet_address

# V2 Upgrade Configuration
V2_TOKEN_MAX_SUPPLY=20000000

# After deployment (auto-populated)
PROXY_ADMIN_ADDRESS=0x...
PROXY_ADDRESS=0x...
```

### 4. Deploy Upgradeable Smart Contract System

```bash
# Compile contracts
npx hardhat compile

# Deploy complete upgradeable system
npm run deploy:proxy

# Or deploy to fullpath network
npm run deploy:proxy:fullpath
```

The deployment script will output the contract addresses. Copy them to your `.env.local` file.

### 5. Upgrade to V2 (Optional)

```bash
# Upgrade to V2 with blacklist/whitelist features
npm run upgrade:token

# Test V2 features
npm run test:v2

# Verify deployment
npm run verify:deployment
```

### 6. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dApp.

## 📖 Usage Guide

### Connecting Your Wallet

1. Install the [Pelagus Wallet](https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop) browser extension
2. Create or import a wallet
3. Switch to Quai Network (Cyprus-1)
4. Click "Connect Wallet" in the dApp

### Tabbed Interface

The dApp features a clean, organized tabbed interface:

#### Main Tab
- **Token Information**: View token metadata, supply statistics, and version info
- **Balance Display**: Check and refresh your token balance
- **Transfer Form**: Send tokens to any address
- **Feature Overview**: Learn about all available token features

#### Permit Tab
- **Permit Operations**: Create and execute gasless approvals
- **Gasless Transfers**: Transfer tokens without separate approval transactions
- **Signature Management**: Handle EIP-712 permit signatures

#### Owner Tab (Contract Owner Only)
- **Owner Controls**: Mint, burn, pause/unpause, and supply management
- **V2 Features**: Blacklist/whitelist management (if upgraded to V2)
- **Compliance Tools**: Advanced compliance and security features

### Token Operations

#### Viewing Token Information
- The dApp automatically displays token metadata, supply statistics, and minting progress
- Version information shows if V2 features are available
- Real-time updates show current supply vs. maximum supply

#### Checking Your Balance
- Your token balance is displayed prominently when connected
- Click the refresh button to update your balance
- Balance updates automatically after transactions

#### Transferring Tokens
1. Navigate to the Main tab
2. Enter the recipient's address
3. Specify the amount to transfer
4. Click "Transfer Tokens"
5. Confirm the transaction in your wallet

#### Owner Functions (Contract Owner Only)
- **Mint Tokens**: Create new tokens and send them to any address
- **Burn Tokens**: Remove tokens from your balance
- **Update Max Supply**: Modify the maximum token supply limit
- **Contract Control**: Pause/unpause contract operations for emergency situations

### 🆕 Permit Operations (EIP-2612)

The dApp includes advanced Permit functionality for gasless approvals:

#### Creating and Signing Permits
1. **Navigate to Permit Tab**: Click on the "Permit" tab in the interface
2. **Enter Spender Address**: The address that will be allowed to spend your tokens
3. **Specify Amount**: The maximum amount to approve
4. **Set Deadline**: When the permit expires (Unix timestamp)
5. **Create Permit Data**: Click "Create Permit Data" to generate EIP-712 structured data
6. **Sign Permit**: Click "Sign Permit" to sign with your wallet

#### Executing Permits
1. **Switch to Execute Tab**: After creating and signing a permit
2. **Review Status**: Check that permit data and signature are ready
3. **Execute Permit**: Click "Execute Permit" to set the allowance on-chain

#### Gasless Transfers
1. **Switch to Permit Transfer Tab**: For gasless token transfers
2. **Enter Recipient**: The address to receive the tokens
3. **Execute Transfer**: Uses permit signature to transfer without separate approval

#### Benefits of Permit Standard
- **Gasless Approvals**: No gas fees for setting allowances
- **Better UX**: No need for separate approval transactions
- **Meta-Transactions**: Third parties can pay gas for permit execution
- **Batch Operations**: Multiple permits in one transaction
- **Mobile Friendly**: Better experience on mobile devices

### 🛡️ V2 Compliance Features (Upgrade Required)

The dApp supports advanced compliance features when upgraded to V2:

#### Blacklist Management
1. **Navigate to Owner Tab**: Only contract owners can access this functionality
2. **Enter Address**: Input the address to blacklist/unblacklist
3. **Check Status**: Verify current blacklist status
4. **Blacklist Address**: Prevent address from sending/receiving tokens
5. **Remove from Blacklist**: Restore normal functionality

#### Whitelist Management
1. **Enable Whitelist Mode**: Toggle whitelist mode on/off
2. **Add to Whitelist**: Allow specific addresses to transfer tokens
3. **Remove from Whitelist**: Remove transfer permissions
4. **Status Checking**: Verify whitelist status of any address

#### Compliance Benefits
- **Regulatory Compliance**: Meet KYC/AML requirements
- **Security Control**: Block suspicious addresses
- **Transfer Restrictions**: Control who can use the token
- **Emergency Response**: Quickly block problematic addresses

### 🛡️ Contract Pausability

The dApp includes emergency pause functionality for contract owners:

#### Pause Status Display
- **Token Information Panel**: Shows current contract status (ACTIVE/PAUSED)
- **Owner Panel**: Detailed pause status with control buttons
- **Real-time Updates**: Status updates immediately after pause/unpause operations

#### Pause/Unpause Operations
1. **Access Owner Panel**: Only contract owners can see the Contract Control section
2. **View Current Status**: Check if contract is currently paused or active
3. **Pause Contract**: Click "⏸️ Pause Contract" to disable all operations
4. **Unpause Contract**: Click "▶️ Unpause Contract" to restore functionality

#### What Gets Paused
When the contract is paused, the following operations are disabled:
- ❌ Token transfers (`transfer`, `transferFrom`)
- ❌ Token minting (`mint`)
- ❌ Token burning (`burn`)
- ❌ Gasless transfers (`permitTransfer`)
- ❌ Batch permits (`batchPermit`)

#### What Remains Available
These functions continue to work even when paused:
- ✅ View functions (`balanceOf`, `totalSupply`, etc.)
- ✅ Permit signature verification (`permit`)
- ✅ Utility functions (`getNonce`, `getDomainSeparator`)
- ✅ Supply management (`updateMaxSupply`)

#### Use Cases
- **Emergency Situations**: Quickly halt all token operations if security issues are detected
- **Maintenance**: Pause during contract upgrades or maintenance
- **Compliance**: Meet regulatory requirements for token operations
- **Security**: Prevent further damage during security incidents

## 🏗️ Project Structure

```
quai-upgradeable-smartcontract/
├── contracts/                 # Smart contracts
│   ├── TestToken.sol         # V1: Enhanced ERC20 token with Permit support
│   ├── TestTokenV2.sol       # V2: Added blacklist/whitelist functionality
│   ├── TestTokenProxyAdmin.sol    # Proxy admin for upgrade management
│   └── TestTokenTransparentProxy.sol # Transparent upgradeable proxy
├── scripts/                  # Deployment scripts
│   ├── initialProxyDeploy.js # Deploy complete upgradeable system
│   ├── upgradeToken.js       # Upgrade to V2 with reinitializer
│   ├── testV2Features.js     # Test V2 functionality
│   ├── verifyDeployment.js   # Verify deployment state
│   └── deployToken.js        # Legacy deployment (V1 only)
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dApp page with tabbed interface
│   │   ├── providers.tsx     # Context providers
│   │   ├── store.tsx         # State management
│   │   └── additional.d.ts   # TypeScript declarations
│   ├── components/           # React components
│   │   ├── ui/               # UI components
│   │   │   └── Tabs.tsx      # Reusable tab component
│   │   ├── tabs/             # Tab content components
│   │   │   ├── MainTab.tsx   # Main functionality tab
│   │   │   ├── PermitTab.tsx # Permit functionality tab
│   │   │   ├── OwnerTab.tsx  # Owner controls tab
│   │   │   └── index.ts      # Tab exports
│   │   ├── token/            # Token-related components
│   │   │   ├── TokenInfo.tsx      # Token metadata display
│   │   │   ├── BalanceDisplay.tsx # User balance management
│   │   │   ├── TransferForm.tsx   # Token transfer interface
│   │   │   ├── OwnerPanel.tsx     # Owner-only functions
│   │   │   ├── PermitPanel.tsx    # Permit functionality
│   │   │   ├── BlacklistWhitelistPanel.tsx # V2 compliance features
│   │   │   ├── VersionInfo.tsx    # Contract version display
│   │   │   └── index.ts           # Component exports
│   │   └── wallet/           # Wallet components
│   │       └── connectButton.tsx  # Enhanced wallet connection
│   ├── hooks/                # Custom React hooks
│   │   └── useIsOwner.ts     # Owner detection hook
│   └── utils/                # Utility functions
│       ├── tokenUtils.ts     # Token contract interactions (V1 & V2)
│       ├── permitUtils.ts    # Permit signature utilities
│       ├── quaisUtils.ts     # Quai Network utilities
│       ├── constants.ts      # Environment constants
│       └── wallet/           # Wallet utilities
│           ├── index.ts
│           ├── requestAccounts.ts
│           └── useGetAccounts.ts
├── artifacts/                # Compiled contracts
├── cache/                    # Hardhat cache
├── metadata/                 # Contract metadata
├── hardhat.config.js         # Hardhat configuration (with viaIR)
├── DEPLOYMENT_GUIDE.md       # Comprehensive deployment guide
└── package.json              # Dependencies and scripts
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Smart Contracts
npm run compile      # Compile contracts
npm run test         # Run contract tests

# Deployment & Upgrades
npm run deploy:proxy          # Deploy complete upgradeable system
npm run deploy:proxy:fullpath # Deploy to fullpath network
npm run upgrade:token         # Upgrade to V2 with reinitializer
npm run upgrade:token:fullpath # Upgrade on fullpath network
npm run test:v2               # Test V2 features
npm run test:v2:fullpath      # Test V2 on fullpath network
npm run verify:deployment     # Verify deployment state
npm run verify:deployment:fullpath # Verify on fullpath network

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Smart Contract Development

The project uses Hardhat for smart contract development with enhanced compilation settings:

```bash
# Compile contracts (with viaIR for complex contracts)
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deployToken.js --network localhost

# Deploy to Quai Network
npx hardhat run scripts/deployToken.js --network cyprus1
```

#### Contract Features

**TestToken.sol (V1)** includes:
- **ERC20 Standard**: Full ERC20 token implementation
- **ERC20Permit Extension**: EIP-2612 permit functionality
- **ERC20Pausable Extension**: Emergency pause functionality
- **Owner Controls**: Mint, burn, supply management, and contract pausability
- **Enhanced Functions**:
  - `getNonce()`: Get current nonce for an address
  - `getDomainSeparator()`: Get EIP-712 domain separator
  - `permitTransfer()`: Gasless transfer using permit
  - `batchPermit()`: Batch multiple permits in one transaction
  - `pause()`: Pause all contract operations (owner only)
  - `unpause()`: Resume contract operations (owner only)
  - `paused()`: Check if contract is currently paused

**TestTokenV2.sol** adds:
- **Blacklist Management**: Block addresses from sending/receiving tokens
- **Whitelist Management**: Restrict transfers to whitelisted addresses only
- **Compliance Features**: Built-in regulatory compliance tools
- **Version Identification**: `version()` function returns "2.0.0"
- **Reinitializer Support**: `initializeV2()` for safe upgrades
- **Enhanced Functions**:
  - `setBlacklisted()`: Add/remove addresses from blacklist
  - `setWhitelisted()`: Add/remove addresses from whitelist
  - `setWhitelistEnabled()`: Enable/disable whitelist mode
  - `isBlacklisted()`: Check blacklist status
  - `isWhitelisted()`: Check whitelist status
  - `isWhitelistEnabled()`: Check whitelist mode status

**Proxy System**:
- **TestTokenTransparentProxy.sol**: Transparent upgradeable proxy
- **TestTokenProxyAdmin.sol**: Secure upgrade management
- **State Preservation**: All balances and settings maintained during upgrades
- **Admin Controls**: Owner-only upgrade permissions

#### Compilation Notes

- **viaIR Compilation**: Enabled to handle complex contracts with many local variables
- **Optimizer**: Enabled with 1000 runs for gas optimization
- **Solidity Version**: 0.8.17+ with London EVM target

## 🌐 Network Configuration

### Quai Network (Cyprus-1)
- **RPC URL**: `https://orchard.rpc.quai.network`
- **Explorer**: `https://orchard.quaiscan.io`
- **Chain ID**: `0x00`

### Adding Custom Networks

To add support for additional networks, update the configuration in:
- `hardhat.config.js` (for contract deployment)
- `src/utils/constants.ts` (for dApp configuration)

## 🆕 What's New

### Latest Updates

- **🔄 Upgradeable Contract System**: Complete transparent proxy implementation with state preservation
- **🛡️ V2 Compliance Features**: Blacklist/whitelist functionality for regulatory compliance
- **📱 Tabbed Interface**: Clean, organized UI with Main, Permit, and Owner tabs
- **🔐 Role-Based Access**: Automatic owner detection with conditional feature access
- **📊 Version Detection**: Real-time contract version identification and V2 feature indicators
- **⚡ Reinitializer Support**: Safe contract upgrades with new initialization data
- **🎯 Enhanced Deployment**: Comprehensive deployment scripts for proxy system
- **🧪 V2 Testing**: Automated testing for all V2 compliance features
- **📋 Deployment Guide**: Complete documentation for upgradeable contract deployment
- **🔧 Advanced Owner Controls**: Enhanced owner panel with V2 compliance tools
- **📱 Mobile Optimization**: Enhanced responsive design for all devices
- **🛡️ Security Features**: Improved error handling and validation

### Migration from Basic ERC20

If you're upgrading from a basic ERC20 token:

1. **Deploy Upgradeable System**: Use the new proxy deployment scripts
2. **Upgrade to V2**: Add compliance features with the upgrade script
3. **Update Frontend**: New tabbed interface with V2 feature detection
4. **Backward Compatibility**: All existing functionality preserved during upgrades
5. **Enhanced Features**: Users get V2 compliance features after upgrade

### Upgrade Path

1. **V1 Deployment**: Deploy basic upgradeable token with permit functionality
2. **V2 Upgrade**: Add blacklist/whitelist compliance features
3. **Future Upgrades**: Easy upgrades with state preservation
4. **Feature Detection**: UI automatically detects and shows available features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility
- Test both traditional approve and permit functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Quai Network](https://qu.ai/)
- [Pelagus Wallet](https://pelaguswallet.io/)
- [OpenZeppelin](https://openzeppelin.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/quai-token-dapp/issues) page
2. Verify your environment variables are set correctly
3. Ensure you're connected to the correct network
4. Check that your contract is deployed and accessible

## 🙏 Acknowledgments

- [Quai Network](https://qua.ai/) for the blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries, ERC20Permit, ERC20Pausable, and upgradeable contracts
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612) for the Permit standard specification
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712) for typed data signing
- [EIP-1967](https://eips.ethereum.org/EIPS/eip-1967) for proxy storage specification
- [Hardhat](https://hardhat.org/) for smart contract development tools

## 📚 Additional Resources

- [EIP-2612 Permit Standard](https://eips.ethereum.org/EIPS/eip-2612)
- [EIP-712 Typed Data Signing](https://eips.ethereum.org/EIPS/eip-712)
- [EIP-1967 Proxy Storage](https://eips.ethereum.org/EIPS/eip-1967)
- [OpenZeppelin ERC20Permit Documentation](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit)
- [OpenZeppelin ERC20Pausable Documentation](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Pausable)
- [OpenZeppelin Upgradeable Contracts](https://docs.openzeppelin.com/contracts/4.x/upgradeable)
- [OpenZeppelin Proxy Patterns](https://docs.openzeppelin.com/contracts/4.x/proxies)
- [Quai Network Documentation](https://docs.qu.ai/)
- [Pelagus Wallet Documentation](https://docs.pelaguswallet.io/)

---

**Built with ❤️ for the Quai Network ecosystem**

*Enhanced with modern Web3 standards, upgradeable contracts, and compliance features for the future of decentralized applications*
