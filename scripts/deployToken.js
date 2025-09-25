const quais = require('quais')
const TokenJson = require('../artifacts/contracts/TestToken.sol/TestToken.json')
const { deployMetadata } = require("hardhat");
require('dotenv').config()

// Pull contract arguments from .env
const tokenArgs = [process.env.TOKEN_NAME, process.env.TOKEN_SYMBOL, quais.parseUnits(process.env.TOKEN_INITIAL_SUPPLY), quais.parseUnits(process.env.TOKEN_MAX_SUPPLY)]

async function deployERC20() {
  // Config provider, wallet, and contract factory
  const provider = new quais.JsonRpcProvider(hre.network.config.url, undefined, { usePathing: true })
  const wallet = new quais.Wallet(hre.network.config.accounts[0], provider)
  const ipfsHash = await deployMetadata.pushMetadataToIPFS("TestToken")
  const Token = new quais.ContractFactory(TokenJson.abi, TokenJson.bytecode, wallet, ipfsHash)

  // Broadcast deploy transaction
  const token = await Token.deploy(...tokenArgs)
  console.log('Transaction broadcasted: ', token.deploymentTransaction().hash)

  // Wait for contract to be deployed
  await token.waitForDeployment()
  console.log('Contract deployed to: ', await token.getAddress())
}

deployERC20()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })