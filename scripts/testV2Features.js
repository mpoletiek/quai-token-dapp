const quais = require('quais')
require('dotenv').config()

// Contract ABIs
const TestTokenV2Json = require('../artifacts/contracts/TestTokenV2.sol/TestTokenV2.json')

async function testV2Features() {
  console.log('🧪 Testing TestTokenV2 features...')
  
  // Configuration
  const PROXY_ADDRESS = process.env.PROXY_ADDRESS
  
  if (!PROXY_ADDRESS) {
    console.error('❌ Missing required environment variable:')
    console.error('   PROXY_ADDRESS - Address of the deployed Transparent Proxy')
    console.error('')
    console.error('💡 Add this to your .env file after deployment')
    process.exit(1)
  }

  console.log(`   Proxy Address: ${PROXY_ADDRESS}`)
  console.log('')

  // Setup provider and wallet
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  console.log(`   Wallet address: ${wallet.address}`)
  console.log('')

  try {
    // Connect to the upgraded contract
    const tokenV2 = new quais.Contract(
      PROXY_ADDRESS,
      TestTokenV2Json.abi,
      wallet
    )

    console.log('📊 V2 Feature Testing:')
    console.log('')

    // Test 1: Check version
    console.log('1️⃣ Version Check:')
    try {
      const version = await tokenV2.version()
      console.log(`   ✅ Contract Version: ${version}`)
    } catch (error) {
      console.log(`   ❌ Version check failed: ${error.message}`)
      console.log('   💡 This might indicate the contract is not upgraded to V2')
      return
    }
    console.log('')

    // Test 2: Check whitelist status
    console.log('2️⃣ Whitelist Status:')
    try {
      const whitelistEnabled = await tokenV2.isWhitelistEnabled()
      console.log(`   ✅ Whitelist Enabled: ${whitelistEnabled}`)
    } catch (error) {
      console.log(`   ❌ Whitelist status check failed: ${error.message}`)
    }
    console.log('')

    // Test 3: Check blacklist status for wallet
    console.log('3️⃣ Blacklist Status:')
    try {
      const isBlacklisted = await tokenV2.isBlacklisted(wallet.address)
      console.log(`   ✅ Wallet Blacklisted: ${isBlacklisted}`)
    } catch (error) {
      console.log(`   ❌ Blacklist status check failed: ${error.message}`)
    }
    console.log('')

    // Test 4: Check whitelist status for wallet
    console.log('4️⃣ Whitelist Status:')
    try {
      const isWhitelisted = await tokenV2.isWhitelisted(wallet.address)
      console.log(`   ✅ Wallet Whitelisted: ${isWhitelisted}`)
    } catch (error) {
      console.log(`   ❌ Whitelist status check failed: ${error.message}`)
    }
    console.log('')

    // Test 5: Test blacklist functionality (if owner)
    console.log('5️⃣ Testing Blacklist Functionality:')
    try {
      // Create a test address
      const testAddress = "0x1234567890123456789012345678901234567890"
      
      // Check if wallet is owner
      const owner = await tokenV2.owner()
      const isOwner = owner.toLowerCase() === wallet.address.toLowerCase()
      
      if (isOwner) {
        console.log(`   ✅ Wallet is owner, testing blacklist functions...`)
        
        // Test blacklisting
        const tx1 = await tokenV2.setBlacklisted(testAddress, true)
        console.log(`   ✅ Blacklist transaction: ${tx1.hash}`)
        await tx1.wait()
        
        // Verify blacklist
        const isBlacklisted = await tokenV2.isBlacklisted(testAddress)
        console.log(`   ✅ Test address blacklisted: ${isBlacklisted}`)
        
        // Test unblacklisting
        const tx2 = await tokenV2.setBlacklisted(testAddress, false)
        console.log(`   ✅ Unblacklist transaction: ${tx2.hash}`)
        await tx2.wait()
        
        // Verify unblacklist
        const isUnblacklisted = await tokenV2.isBlacklisted(testAddress)
        console.log(`   ✅ Test address unblacklisted: ${!isUnblacklisted}`)
        
      } else {
        console.log(`   ⚠️  Wallet is not owner (${owner}), skipping blacklist tests`)
      }
    } catch (error) {
      console.log(`   ❌ Blacklist functionality test failed: ${error.message}`)
    }
    console.log('')

    // Test 6: Test whitelist functionality (if owner)
    console.log('6️⃣ Testing Whitelist Functionality:')
    try {
      const testAddress = "0x1234567890123456789012345678901234567890"
      const owner = await tokenV2.owner()
      const isOwner = owner.toLowerCase() === wallet.address.toLowerCase()
      
      if (isOwner) {
        console.log(`   ✅ Wallet is owner, testing whitelist functions...`)
        
        // Test whitelisting
        const tx1 = await tokenV2.setWhitelisted(testAddress, true)
        console.log(`   ✅ Whitelist transaction: ${tx1.hash}`)
        await tx1.wait()
        
        // Verify whitelist
        const isWhitelisted = await tokenV2.isWhitelisted(testAddress)
        console.log(`   ✅ Test address whitelisted: ${isWhitelisted}`)
        
        // Test unwhitelisting
        const tx2 = await tokenV2.setWhitelisted(testAddress, false)
        console.log(`   ✅ Unwhitelist transaction: ${tx2.hash}`)
        await tx2.wait()
        
        // Verify unwhitelist
        const isUnwhitelisted = await tokenV2.isWhitelisted(testAddress)
        console.log(`   ✅ Test address unwhitelisted: ${!isUnwhitelisted}`)
        
      } else {
        console.log(`   ⚠️  Wallet is not owner (${owner}), skipping whitelist tests`)
      }
    } catch (error) {
      console.log(`   ❌ Whitelist functionality test failed: ${error.message}`)
    }
    console.log('')

    // Test 7: Test whitelist toggle (if owner)
    console.log('7️⃣ Testing Whitelist Toggle:')
    try {
      const owner = await tokenV2.owner()
      const isOwner = owner.toLowerCase() === wallet.address.toLowerCase()
      
      if (isOwner) {
        console.log(`   ✅ Wallet is owner, testing whitelist toggle...`)
        
        // Get current state
        const currentState = await tokenV2.isWhitelistEnabled()
        console.log(`   ✅ Current whitelist state: ${currentState}`)
        
        // Toggle whitelist
        const tx = await tokenV2.setWhitelistEnabled(!currentState)
        console.log(`   ✅ Toggle transaction: ${tx.hash}`)
        await tx.wait()
        
        // Verify toggle
        const newState = await tokenV2.isWhitelistEnabled()
        console.log(`   ✅ New whitelist state: ${newState}`)
        
        // Toggle back
        const tx2 = await tokenV2.setWhitelistEnabled(currentState)
        console.log(`   ✅ Restore transaction: ${tx2.hash}`)
        await tx2.wait()
        
        // Verify restore
        const restoredState = await tokenV2.isWhitelistEnabled()
        console.log(`   ✅ Restored whitelist state: ${restoredState}`)
        
      } else {
        console.log(`   ⚠️  Wallet is not owner (${owner}), skipping whitelist toggle test`)
      }
    } catch (error) {
      console.log(`   ❌ Whitelist toggle test failed: ${error.message}`)
    }
    console.log('')

    // Test 8: Verify existing functionality still works
    console.log('8️⃣ Testing Existing Functionality:')
    try {
      const name = await tokenV2.name()
      const symbol = await tokenV2.symbol()
      const totalSupply = await tokenV2.totalSupply()
      const maxSupply = await tokenV2.maxSupply()
      const owner = await tokenV2.owner()
      const balance = await tokenV2.balanceOf(wallet.address)
      
      console.log(`   ✅ Name: ${name}`)
      console.log(`   ✅ Symbol: ${symbol}`)
      console.log(`   ✅ Total Supply: ${quais.formatUnits(totalSupply, 18)}`)
      console.log(`   ✅ Max Supply: ${quais.formatUnits(maxSupply, 18)}`)
      console.log(`   ✅ Owner: ${owner}`)
      console.log(`   ✅ Wallet Balance: ${quais.formatUnits(balance, 18)}`)
      
    } catch (error) {
      console.log(`   ❌ Existing functionality test failed: ${error.message}`)
    }
    console.log('')

    console.log('🎉 V2 feature testing completed!')
    console.log('')
    console.log('📋 Test Summary:')
    console.log(`   Proxy Address: ${PROXY_ADDRESS}`)
    console.log(`   Network: ${hre.network.name}`)
    console.log(`   Wallet: ${wallet.address}`)
    console.log('')

  } catch (error) {
    console.error('❌ V2 feature testing failed:', error.message)
    throw error
  }
}

// Execute testing
testV2Features()
  .then(() => {
    console.log('✅ V2 feature testing completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ V2 feature testing failed:', error)
    process.exit(1)
  })
