# TestToken dApp

A comprehensive decentralized application (dApp) for interacting with ERC20 tokens on the Quai Network. This project demonstrates modern Web3 development practices with a full-featured token management interface.

![TestToken dApp](https://img.shields.io/badge/TestToken-dApp-blue)
![Quai Network](https://img.shields.io/badge/Network-Quai-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🚀 Features

### Core Functionality
- **Token Information Display**: View token metadata, supply statistics, and minting progress
- **Balance Management**: Check and refresh token balances with real-time updates
- **Token Transfers**: Send tokens to any address with validation and transaction feedback
- **Owner Controls**: Mint new tokens, burn existing tokens, and manage supply limits (owner only)
- **Wallet Integration**: Connect with Pelagus wallet for Quai Network

### User Experience
- **Modern UI**: Clean, responsive design with dark mode support
- **Real-time Updates**: Live balance and transaction status updates
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Smooth loading indicators for all operations
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom components
- **Blockchain**: Quai Network, Quais.js SDK
- **Smart Contracts**: Solidity, OpenZeppelin contracts
- **Wallet**: Pelagus wallet integration
- **Build Tools**: Hardhat, ESLint, PostCSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Pelagus Wallet](https://chromewebstore.google.com/detail/pelagus/nhccebmfjcbhghphpclcfdkkekheegop) (for Quai Network)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quai-token-dapp.git
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
NEXT_PUBLIC_RPC_URL=https://rpc.cyprus1.colosseum.quaiscan.io
NEXT_PUBLIC_EXPLORER_URL=https://cyprus1.colosseum.quaiscan.io
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

## 🏗️ Project Structure

```
quai-token-dapp/
├── contracts/                 # Smart contracts
│   └── TestToken.sol         # ERC20 token contract
├── scripts/                  # Deployment scripts
│   └── deployToken.js        # Contract deployment
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main dApp page
│   │   ├── providers.tsx     # Context providers
│   │   └── store.tsx         # State management
│   ├── components/           # React components
│   │   ├── token/            # Token-related components
│   │   │   ├── TokenInfo.tsx
│   │   │   ├── BalanceDisplay.tsx
│   │   │   ├── TransferForm.tsx
│   │   │   ├── OwnerPanel.tsx
│   │   │   └── ContractStatus.tsx
│   │   └── wallet/           # Wallet components
│   │       └── connectButton.tsx
│   └── utils/                # Utility functions
│       ├── tokenUtils.ts     # Token contract interactions
│       ├── quaisUtils.ts     # Quai Network utilities
│       └── constants.ts      # Environment constants
├── artifacts/                # Compiled contracts
├── hardhat.config.js         # Hardhat configuration
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

The project uses Hardhat for smart contract development:

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deployToken.js --network localhost

# Deploy to Quai Network
npx hardhat run scripts/deployToken.js --network cyprus1
```

## 🌐 Network Configuration

### Quai Network (Cyprus-1)
- **RPC URL**: `https://rpc.cyprus1.colosseum.quaiscan.io`
- **Explorer**: `https://cyprus1.colosseum.quaiscan.io`
- **Chain ID**: `0x00`

### Adding Custom Networks

To add support for additional networks, update the configuration in:
- `hardhat.config.js` (for contract deployment)
- `src/utils/constants.ts` (for dApp configuration)

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Quai Network](https://quai.network/)
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

- [Quai Network](https://quai.network/) for the blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract libraries
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities

---

**Built with ❤️ for the Quai Network ecosystem**
