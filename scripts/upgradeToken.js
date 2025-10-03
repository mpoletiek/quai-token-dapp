const quais = require('quais')
const { deployMetadata } = require("hardhat");
require('dotenv').config()

// Contract ABIs
const TestTokenJson = require('../artifacts/contracts/TestToken.sol/TestToken.json')
const TestTokenV2Json = require('../artifacts/contracts/TestTokenV2.sol/TestTokenV2.json')
const TestTokenProxyAdminJson = require('../artifacts/contracts/TestTokenProxyAdmin.sol/TestTokenProxyAdmin.json')

async function upgradeToken() {
  console.log('🔄 Starting token upgrade...')
  
  // Configuration - Update these addresses after initial deployment
  const PROXY_ADMIN_ADDRESS = process.env.PROXY_ADMIN_ADDRESS
  const PROXY_ADDRESS = process.env.PROXY_ADDRESS
  
  if (!PROXY_ADMIN_ADDRESS || !PROXY_ADDRESS) {
    console.error('❌ Missing required environment variables:')
    console.error('   PROXY_ADMIN_ADDRESS - Address of the deployed ProxyAdmin')
    console.error('   PROXY_ADDRESS - Address of the deployed Transparent Proxy')
    console.error('')
    console.error('💡 Add these to your .env file after initial deployment')
    process.exit(1)
  }

  console.log(`   Proxy Admin: ${PROXY_ADMIN_ADDRESS}`)
  console.log(`   Proxy: ${PROXY_ADDRESS}`)
  
  // V2 upgrade configuration
  const V2_TOKEN_MAX_SUPPLY = process.env.V2_TOKEN_MAX_SUPPLY || "20000000"
  const newMaxSupply = quais.parseUnits(V2_TOKEN_MAX_SUPPLY, 18)
  console.log(`   V2 Max Supply: ${quais.formatUnits(newMaxSupply, 18)}`)
  console.log('')

  // Step 1: Setup RPC provider and wallet
  console.log('1️⃣ Setting up RPC provider and wallet...')
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  console.log(`   Wallet address: ${wallet.address}`)
  console.log('')

  // Step 2: Deploy new implementation
  console.log('2️⃣ Deploying new TestTokenV2 implementation...')
  const ipfsHash = await deployMetadata.pushMetadataToIPFS("TestTokenV2")
  const TestTokenFactory = new quais.ContractFactory(
    TestTokenV2Json.abi, 
    TestTokenV2Json.bytecode, 
    wallet, 
    ipfsHash
  )
  
  const newImplementation = await TestTokenFactory.deploy()
  console.log(`   New implementation deployment tx: ${newImplementation.deploymentTransaction().hash}`)
  await newImplementation.waitForDeployment()
  const newImplementationAddress = await newImplementation.getAddress()
  console.log(`   ✅ New implementation deployed to: ${newImplementationAddress}`)
  console.log('')

  // Step 3: Connect to existing ProxyAdmin
  console.log('3️⃣ Connecting to existing ProxyAdmin...')
  const proxyAdmin = new quais.Contract(
    PROXY_ADMIN_ADDRESS,
    TestTokenProxyAdminJson.abi,
    wallet
  )
  console.log(`   ✅ Connected to ProxyAdmin at: ${PROXY_ADMIN_ADDRESS}`)
  console.log('')

  // Step 4: Encode reinitializer call
  console.log('4️⃣ Encoding V2 reinitializer call...')
  const TestTokenV2Factory = new quais.ContractFactory(
    TestTokenV2Json.abi,
    TestTokenV2Json.bytecode,
    wallet
  )
  const initData = TestTokenV2Factory.interface.encodeFunctionData('initializeV2', [newMaxSupply])
  console.log(`   ✅ Reinitializer data encoded (${initData.length} bytes)`)
  console.log('')

  // Step 5: Perform upgrade with reinitializer
  console.log('5️⃣ Performing upgrade with reinitializer...')
  const upgradeTx = await proxyAdmin.upgradeAndCall(
    PROXY_ADDRESS,
    newImplementationAddress,
    initData, // V2 reinitializer data
    { gasLimit: 500000 } // Provide sufficient gas
  )
  console.log(`   Upgrade transaction: ${upgradeTx.hash}`)
  await upgradeTx.wait()
  console.log(`   ✅ Upgrade completed successfully with reinitializer`)
  console.log('')

  // Step 6: Verify upgrade
  console.log('6️⃣ Verifying upgrade...')
  const tokenProxy = new quais.Contract(
    PROXY_ADDRESS,
    TestTokenV2Json.abi,
    wallet
  )
  
  try {
    const name = await tokenProxy.name()
    const symbol = await tokenProxy.symbol()
    const totalSupply = await tokenProxy.totalSupply()
    const maxSupply = await tokenProxy.maxSupply()
    const version = await tokenProxy.version()
    const whitelistEnabled = await tokenProxy.isWhitelistEnabled()
    
    console.log('   📊 Post-Upgrade Verification:')
    console.log(`      Name: ${name}`)
    console.log(`      Symbol: ${symbol}`)
    console.log(`      Total Supply: ${quais.formatUnits(totalSupply, 18)}`)
    console.log(`      Max Supply: ${quais.formatUnits(maxSupply, 18)}`)
    console.log(`      Version: ${version}`)
    console.log(`      Whitelist Enabled: ${whitelistEnabled}`)
    console.log('')

    console.log('🎉 Upgrade completed successfully!')
    console.log('')
    console.log('📋 Upgrade Summary:')
    console.log(`   Old Implementation: [Previous version]`)
    console.log(`   New Implementation: ${newImplementationAddress}`)
    console.log(`   Proxy Address: ${PROXY_ADDRESS}`)
    console.log(`   Proxy Admin: ${PROXY_ADMIN_ADDRESS}`)
    console.log(`   New Max Supply: ${quais.formatUnits(newMaxSupply, 18)}`)
    console.log(`   Reinitializer Used: initializeV2()`)
    console.log('')

  } catch (error) {
    console.error('❌ Error verifying upgrade:', error.message)
    throw error
  }
}

// Execute upgrade
upgradeToken()
  .then(() => {
    console.log('✅ Upgrade script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Upgrade failed:', error)
    process.exit(1)
  })
