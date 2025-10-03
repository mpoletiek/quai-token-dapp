const quais = require('quais')
const { deployMetadata } = require("hardhat");
require('dotenv').config()

// Contract ABIs and bytecode
const TestTokenJson = require('../artifacts/contracts/TestToken.sol/TestToken.json')
const TestTokenProxyAdminJson = require('../artifacts/contracts/TestTokenProxyAdmin.sol/TestTokenProxyAdmin.json')
const TestTokenTransparentProxyJson = require('../artifacts/contracts/TestTokenTransparentProxy.sol/TestTokenTransparentProxy.json')

// Pull contract arguments from .env
const tokenArgs = {
  name: process.env.TOKEN_NAME || "Test Token",
  symbol: process.env.TOKEN_SYMBOL || "TEST",
  initialSupply: quais.parseUnits(process.env.TOKEN_INITIAL_SUPPLY || "1000000", 18),
  maxSupply: quais.parseUnits(process.env.TOKEN_MAX_SUPPLY || "10000000", 18),
  initialOwner: process.env.INITIAL_OWNER || process.env.CYPRUS1_ADDRESS
}

async function deployUpgradeableToken() {
  console.log('🚀 Starting upgradeable token deployment...')
  console.log('📋 Token Configuration:')
  console.log(`   Name: ${tokenArgs.name}`)
  console.log(`   Symbol: ${tokenArgs.symbol}`)
  console.log(`   Initial Supply: ${quais.formatUnits(tokenArgs.initialSupply, 18)}`)
  console.log(`   Max Supply: ${quais.formatUnits(tokenArgs.maxSupply, 18)}`)
  console.log(`   Initial Owner: ${tokenArgs.initialOwner}`)
  console.log('')

  // Step 1: Setup RPC provider and wallet
  console.log('1️⃣ Setting up RPC provider and wallet...')
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  console.log(`   Wallet address: ${wallet.address}`)
  console.log(`   Network: ${hre.network.name}`)
  console.log('')

  // Step 2: Deploy implementation contract
  console.log('2️⃣ Deploying TestToken implementation contract...')
  const ipfsHash = await deployMetadata.pushMetadataToIPFS("TestToken")
  const TestTokenFactory = new quais.ContractFactory(
    TestTokenJson.abi, 
    TestTokenJson.bytecode, 
    wallet, 
    ipfsHash
  )
  
  const implementation = await TestTokenFactory.deploy()
  console.log(`   Implementation deployment tx: ${implementation.deploymentTransaction().hash}`)
  await implementation.waitForDeployment()
  const implementationAddress = await implementation.getAddress()
  console.log(`   ✅ Implementation deployed to: ${implementationAddress}`)
  console.log('')

  // Step 3: Deploy ProxyAdmin contract
  console.log('3️⃣ Deploying ProxyAdmin contract...')
  const ipfsHashProxyAdmin = await deployMetadata.pushMetadataToIPFS("TestTokenProxyAdmin")
  const ProxyAdminFactory = new quais.ContractFactory(
    TestTokenProxyAdminJson.abi,
    TestTokenProxyAdminJson.bytecode,
    wallet,
    ipfsHashProxyAdmin
  )
  
  const proxyAdmin = await ProxyAdminFactory.deploy(wallet.address)
  console.log(`   ProxyAdmin deployment tx: ${proxyAdmin.deploymentTransaction().hash}`)
  await proxyAdmin.waitForDeployment()
  const proxyAdminAddress = await proxyAdmin.getAddress()
  console.log(`   ✅ ProxyAdmin deployed to: ${proxyAdminAddress}`)
  console.log('')

  // Step 4: Encode initialization data
  console.log('4️⃣ Encoding initialization data...')
  const initData = TestTokenFactory.interface.encodeFunctionData('initialize', [
    tokenArgs.name,
    tokenArgs.symbol,
    tokenArgs.initialSupply,
    tokenArgs.maxSupply,
    tokenArgs.initialOwner
  ])
  console.log(`   ✅ Initialization data encoded (${initData.length} bytes)`)
  console.log('')

  // Step 5: Deploy Transparent Upgradeable Proxy with initialization data
  console.log('5️⃣ Deploying Transparent Upgradeable Proxy...')
  const ipfsHashTransparentProxy = await deployMetadata.pushMetadataToIPFS("TestTokenTransparentProxy")
  const TransparentProxyFactory = new quais.ContractFactory(
    TestTokenTransparentProxyJson.abi,
    TestTokenTransparentProxyJson.bytecode,
    wallet,
    ipfsHashTransparentProxy
  )
  
  const transparentProxy = await TransparentProxyFactory.deploy(
    implementationAddress,  // _logic (implementation)
    proxyAdminAddress,      // initialOwner (proxy admin)
    initData               // _data (initialization data)
  )
  console.log(`   Proxy deployment tx: ${transparentProxy.deploymentTransaction().hash}`)
  await transparentProxy.waitForDeployment()
  const proxyAddress = await transparentProxy.getAddress()
  console.log(`   ✅ Transparent Proxy deployed to: ${proxyAddress}`)
  console.log('')

  // Step 6: Attach proxy to interface to interact with it
  console.log('6️⃣ Attaching proxy to TestToken interface...')
  const tokenProxy = new quais.Contract(
    proxyAddress,
    TestTokenJson.abi,
    wallet
  )
  console.log(`   ✅ Proxy attached to interface at: ${proxyAddress}`)
  console.log('')

  // Step 7: Read values from proxy contract to confirm deployment
  console.log('7️⃣ Verifying deployment by reading contract values...')
  try {
    const name = await tokenProxy.name()
    const symbol = await tokenProxy.symbol()
    const decimals = await tokenProxy.decimals()
    const totalSupply = await tokenProxy.totalSupply()
    const maxSupply = await tokenProxy.maxSupply()
    const owner = await tokenProxy.owner()
    const balance = await tokenProxy.balanceOf(tokenArgs.initialOwner)
    
    console.log('   📊 Contract State Verification:')
    console.log(`      Name: ${name}`)
    console.log(`      Symbol: ${symbol}`)
    console.log(`      Decimals: ${decimals}`)
    console.log(`      Total Supply: ${quais.formatUnits(totalSupply, 18)}`)
    console.log(`      Max Supply: ${quais.formatUnits(maxSupply, 18)}`)
    console.log(`      Owner: ${owner}`)
    console.log(`      Initial Owner Balance: ${quais.formatUnits(balance, 18)}`)
    console.log('')

    console.log('🎉 Deployment completed successfully!')
    console.log('')
    console.log('📋 Deployment Summary:')
    console.log(`   Implementation: ${implementationAddress}`)
    console.log(`   Proxy Admin: ${proxyAdminAddress}`)
    console.log(`   Transparent Proxy: ${proxyAddress}`)
    console.log(`   Token Name: ${name}`)
    console.log(`   Token Symbol: ${symbol}`)
    console.log('')
    console.log('💡 Next Steps:')
    console.log('   - Use the proxy address for all token interactions')
    console.log('   - Keep the implementation address for future upgrades')
    console.log('   - Use the proxy admin to manage upgrades')
    console.log('')

  } catch (error) {
    console.error('❌ Error verifying deployment:', error.message)
    throw error
  }
}

// Execute deployment
deployUpgradeableToken()
  .then(() => {
    console.log('✅ Deployment script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Deployment failed:', error)
    process.exit(1)
  })
