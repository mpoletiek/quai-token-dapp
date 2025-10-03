const quais = require('quais')
require('dotenv').config()

// Contract ABIs
const TestTokenJson = require('../artifacts/contracts/TestToken.sol/TestToken.json')
const TestTokenProxyAdminJson = require('../artifacts/contracts/TestTokenProxyAdmin.sol/TestTokenProxyAdmin.json')
const TestTokenTransparentProxyJson = require('../artifacts/contracts/TestTokenTransparentProxy.sol/TestTokenTransparentProxy.json')

async function verifyDeployment() {
  console.log('🔍 Verifying upgradeable token deployment...')
  
  // Configuration - Update these addresses after deployment
  const PROXY_ADMIN_ADDRESS = process.env.PROXY_ADMIN_ADDRESS
  const PROXY_ADDRESS = process.env.PROXY_ADDRESS
  
  if (!PROXY_ADMIN_ADDRESS || !PROXY_ADDRESS) {
    console.error('❌ Missing required environment variables:')
    console.error('   PROXY_ADMIN_ADDRESS - Address of the deployed ProxyAdmin')
    console.error('   PROXY_ADDRESS - Address of the deployed Transparent Proxy')
    console.error('')
    console.error('💡 Add these to your .env file after deployment')
    process.exit(1)
  }

  console.log(`   Proxy Admin: ${PROXY_ADMIN_ADDRESS}`)
  console.log(`   Proxy: ${PROXY_ADDRESS}`)
  console.log('')

  // Setup provider and wallet
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  console.log(`   Wallet address: ${wallet.address}`)
  console.log('')

  try {
    // Connect to contracts
    const proxyAdmin = new quais.Contract(
      PROXY_ADMIN_ADDRESS,
      TestTokenProxyAdminJson.abi,
      wallet
    )
    
    const transparentProxy = new quais.Contract(
      PROXY_ADDRESS,
      TestTokenTransparentProxyJson.abi,
      wallet
    )
    
    const tokenProxy = new quais.Contract(
      PROXY_ADDRESS,
      TestTokenJson.abi,
      wallet
    )

    console.log('📊 Contract Verification Results:')
    console.log('')

    // 1. Verify ProxyAdmin
    console.log('1️⃣ ProxyAdmin Verification:')
    try {
      const proxyAdminOwner = await proxyAdmin.owner()
      const upgradeInterfaceVersion = await proxyAdmin.UPGRADE_INTERFACE_VERSION()
      console.log(`   ✅ Owner: ${proxyAdminOwner}`)
      console.log(`   ✅ Upgrade Interface Version: ${upgradeInterfaceVersion}`)
      console.log(`   ✅ Wallet is owner: ${proxyAdminOwner.toLowerCase() === wallet.address.toLowerCase()}`)
    } catch (error) {
      console.log(`   ❌ Error reading ProxyAdmin: ${error.message}`)
    }
    console.log('')

    // 2. Verify Transparent Proxy
    console.log('2️⃣ Transparent Proxy Verification:')
    try {
      const proxyAdminFromProxy = await transparentProxy._proxyAdmin()
      console.log(`   ✅ Proxy Admin from Proxy: ${proxyAdminFromProxy}`)
      console.log(`   ✅ Admin matches: ${proxyAdminFromProxy.toLowerCase() === PROXY_ADMIN_ADDRESS.toLowerCase()}`)
    } catch (error) {
      console.log(`   ❌ Error reading Transparent Proxy: ${error.message}`)
    }
    console.log('')

    // 3. Verify Token Implementation
    console.log('3️⃣ Token Implementation Verification:')
    try {
      const name = await tokenProxy.name()
      const symbol = await tokenProxy.symbol()
      const decimals = await tokenProxy.decimals()
      const totalSupply = await tokenProxy.totalSupply()
      const maxSupply = await tokenProxy.maxSupply()
      const owner = await tokenProxy.owner()
      const totalMinted = await tokenProxy.totalMinted()
      
      console.log(`   ✅ Name: ${name}`)
      console.log(`   ✅ Symbol: ${symbol}`)
      console.log(`   ✅ Decimals: ${decimals}`)
      console.log(`   ✅ Total Supply: ${quais.formatUnits(totalSupply, 18)}`)
      console.log(`   ✅ Max Supply: ${quais.formatUnits(maxSupply, 18)}`)
      console.log(`   ✅ Owner: ${owner}`)
      console.log(`   ✅ Total Minted: ${quais.formatUnits(totalMinted, 18)}`)
    } catch (error) {
      console.log(`   ❌ Error reading Token Implementation: ${error.message}`)
    }
    console.log('')

    // 4. Verify Permissions
    console.log('4️⃣ Permission Verification:')
    try {
      const isPaused = await tokenProxy.paused()
      console.log(`   ✅ Contract Paused: ${isPaused}`)
      
      // Check if wallet can mint (should be owner)
      const walletBalance = await tokenProxy.balanceOf(wallet.address)
      console.log(`   ✅ Wallet Balance: ${quais.formatUnits(walletBalance, 18)}`)
    } catch (error) {
      console.log(`   ❌ Error checking permissions: ${error.message}`)
    }
    console.log('')

    // 5. Verify ERC20 Permit functionality
    console.log('5️⃣ ERC20 Permit Verification:')
    try {
      const domainSeparator = await tokenProxy.getDomainSeparator()
      const nonce = await tokenProxy.getNonce(wallet.address)
      console.log(`   ✅ Domain Separator: ${domainSeparator}`)
      console.log(`   ✅ Wallet Nonce: ${nonce}`)
    } catch (error) {
      console.log(`   ❌ Error checking permit functionality: ${error.message}`)
    }
    console.log('')

    console.log('🎉 Deployment verification completed!')
    console.log('')
    console.log('📋 Summary:')
    console.log(`   Proxy Admin: ${PROXY_ADMIN_ADDRESS}`)
    console.log(`   Transparent Proxy: ${PROXY_ADDRESS}`)
    console.log(`   Network: ${hre.network.name}`)
    console.log('')

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    throw error
  }
}

// Execute verification
verifyDeployment()
  .then(() => {
    console.log('✅ Verification script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  })
