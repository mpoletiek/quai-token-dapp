# TestToken dApp

A comprehensive decentralized application (dApp) for interacting with ERC20 tokens on the Quai Network. This project demonstrates modern Web3 development practices with a full-featured token management interface, including advanced Permit standard (EIP-2612) support for gasless approvals.

![TestToken dApp](https://img.shields.io/badge/TestToken-dApp-blue)
![Quai Network](https://img.shields.io/badge/Network-Quai-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![EIP-2612](https://img.shields.io/badge/EIP--2612-Permit-orange)

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

### User Experience
- **Modern UI**: Clean, responsive design with dark mode support
- **Real-time Updates**: Live balance and transaction status updates
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Smooth loading indicators for all operations
- **Mobile Responsive**: Optimized for all device sizes
- **Tabbed Interface**: Organized permit functionality with intuitive navigation

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Blockchain**: Quai Network, Quais.js SDK
- **Smart Contracts**: Solidity 0.8.17+, OpenZeppelin contracts (ERC20, ERC20Permit, ERC20Pausable)
- **Wallet**: Pelagus wallet integration
- **Build Tools**: Hardhat (with viaIR compilation), ESLint, PostCSS
- **Standards**: EIP-2612 (Permit), EIP-712 (Typed Data Signing)

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
CHAIN_ID=0x00

# Contract Configuration (set after deployment)
NEXT_PUBLIC_DEPLOYED_CONTRACT=0x0000000000000000000000000000000000000000
INITIAL_OWNER=0x0000000000000000000000000000000000000000

# Token Configuration (for deployment)
TOKEN_NAME=TestToken
TOKEN_SYMBOL=TEST
TOKEN_INITIAL_SUPPLY=1000000
TOKEN_MAX_SUPPLY=10000000

# Private Key (for deployment only - keep secure!)
PRIVATE_KEY=your_private_key_here
```

### 4. Deploy Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy to Quai Network
npx hardhat run scripts/deployToken.js --network cyprus1
```

Copy the deployed contract address to your `.env.local` file.

### 5. Start Development Server

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

### Token Operations

#### Viewing Token Information
- The dApp automatically displays token metadata, supply statistics, and minting progress
- Real-time updates show current supply vs. maximum supply

#### Checking Your Balance
- Your token balance is displayed prominently when connected
- Click the refresh button to update your balance
- Balance updates automatically after transactions

#### Transferring Tokens
1. Enter the recipient's address
2. Specify the amount to transfer
3. Click "Transfer Tokens"
4. Confirm the transaction in your wallet

#### Owner Functions (Contract Owner Only)
- **Mint Tokens**: Create new tokens and send them to any address
- **Burn Tokens**: Remove tokens from your balance
- **Update Max Supply**: Modify the maximum token supply limit
- **Contract Control**: Pause/unpause contract operations for emergency situations

### 🆕 Permit Operations (EIP-2612)

The dApp includes advanced Permit functionality for gasless approvals:

#### Creating and Signing Permits
1. **Navigate to Permit Panel**: Located below the main token operations
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
quai-token-dapp/
├── contracts/                 # Smart contracts
│   └── TestToken.sol         # Enhanced ERC20 token with Permit support
├── scripts/                  # Deployment scripts
│   └── deployToken.js        # Contract deployment
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dApp page
│   │   ├── providers.tsx     # Context providers
│   │   ├── store.tsx         # State management
│   │   └── additional.d.ts   # TypeScript declarations
│   ├── components/           # React components
│   │   ├── token/            # Token-related components
│   │   │   ├── TokenInfo.tsx      # Token metadata display (with pause status)
│   │   │   ├── BalanceDisplay.tsx # User balance management
│   │   │   ├── TransferForm.tsx   # Token transfer interface
│   │   │   ├── OwnerPanel.tsx     # Owner-only functions (with pause controls)
│   │   │   ├── PermitPanel.tsx    # 🆕 Permit functionality
│   │   │   └── index.ts           # Component exports
│   │   └── wallet/           # Wallet components
│   │       └── connectButton.tsx  # Enhanced wallet connection
│   └── utils/                # Utility functions
│       ├── tokenUtils.ts     # Token contract interactions (with pause functions)
│       ├── permitUtils.ts    # 🆕 Permit signature utilities
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
npm run deploy       # Deploy contracts

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

The `TestToken.sol` contract includes:

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

- **Contract Pausability**: Emergency pause/unpause functionality for contract owners
- **Enhanced Owner Panel**: New contract control section with pause status indicators
- **Real-time Status Display**: Live pause status in token information panel
- **Permit Standard Support**: Full EIP-2612 implementation for gasless approvals
- **Enhanced UI**: New PermitPanel with tabbed interface for better UX
- **Advanced Contract Features**: Batch permits, gasless transfers, and nonce management
- **Improved Compilation**: viaIR compilation for handling complex contracts
- **Better Error Handling**: Comprehensive validation and user feedback
- **Mobile Optimization**: Enhanced responsive design for all devices

### Migration from Basic Approve

If you're upgrading from a basic ERC20 token:

1. **Deploy New Contract**: The enhanced TestToken includes Permit functionality
2. **Update Frontend**: New components automatically handle both approve and permit methods
3. **Backward Compatibility**: Traditional approve/transferFrom still works
4. **Enhanced Features**: Users can now choose between gasless permits or traditional approvals

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
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries, ERC20Permit, and ERC20Pausable
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612) for the Permit standard specification
- [EIP-712](https://eips.ethereum.org/EIPS/eip-712) for typed data signing
- [Hardhat](https://hardhat.org/) for smart contract development tools

## 📚 Additional Resources

- [EIP-2612 Permit Standard](https://eips.ethereum.org/EIPS/eip-2612)
- [EIP-712 Typed Data Signing](https://eips.ethereum.org/EIPS/eip-712)
- [OpenZeppelin ERC20Permit Documentation](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Permit)
- [OpenZeppelin ERC20Pausable Documentation](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#ERC20Pausable)
- [Quai Network Documentation](https://docs.qu.ai/)
- [Pelagus Wallet Documentation](https://docs.pelaguswallet.io/)

---

**Built with ❤️ for the Quai Network ecosystem**

*Enhanced with modern Web3 standards for the future of decentralized applications*
