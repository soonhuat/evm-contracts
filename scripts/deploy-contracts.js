// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const { Wallet } = require("ethers");
const ethers = hre.ethers;
require("dotenv").config();
const logging = true;
const show_verify = true;


async function main() {
  const url = process.env.NETWORK_RPC_URL;
  console.log("Using RPC: " + url);
  if (!url) {
    console.error("Missing NETWORK_RPC_URL. Aborting..");
    return null;
  }
  
  const connection = {
    url: url,
    headers: { "User-Agent" : "Soon Huat Deployer"}
  };
  const provider = new ethers.providers.StaticJsonRpcProvider(connection);
  const network = provider.getNetwork();
  // utils
  const networkDetails = await network;
  console.log("Using networkDetails: ", networkDetails);

  let wallet;
  if (process.env.MNEMONIC)
    wallet = new Wallet.fromMnemonic(process.env.MNEMONIC);
  if (process.env.PRIVATE_KEY) wallet = new Wallet(process.env.PRIVATE_KEY);
  if (!wallet) {
    console.error("Missing MNEMONIC or PRIVATE_KEY. Aborting..");
    return null;
  }
  owner = wallet.connect(provider);
  let gasLimit = 8000000;
  let gasPrice = null;
  console.log("Using chain " + networkDetails.chainId);
  const networkName = "polygonedge";

  let options
  if (gasPrice) {
    options = { gasLimit: gasLimit, gasPrice: gasPrice }
  }
  else {
    options = { gasLimit }
  }
  
  if (logging) console.info("Deploying Stablecoin");
  const contract = await ethers.getContractFactory("Stablecoin", owner);
  const tx = await contract.connect(owner).deploy("USD Coin", "USDC", 6, options);
  await tx.deployTransaction.wait();
  if (show_verify) {
    console.log("\tRun the following to verify on etherscan");
    console.log("\tnpx hardhat verify --network " + networkName + " " + tx.address + " " + owner.address)
  }
}


async function sleep(s) {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000)
  })
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
