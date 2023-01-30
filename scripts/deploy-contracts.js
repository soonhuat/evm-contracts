// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");
const { Wallet } = require("ethers");
const { UV_FS_O_FILEMAP } = require("constants");
const ethers = hre.ethers;
require("dotenv").config();
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"
let shouldDeployV4 = true;
let shouldDeployDF = true;
let shouldDeployVE = true;
let shouldDeployOceanToken = false;
let shouldDeployMocks = false;
let shouldDeployOPFCommunityFeeCollector = false;
let shouldDeployOPFCommunity = true;
const logging = true;
const show_verify = true;


async function main() {
  const url = process.env.NETWORK_RPC_URL;
  console.log("Using RPC: " + url);
  if (!url) {
    console.error("Missing NETWORK_RPC_URL. Aborting..");
    return null;
  }
  if (!process.env.ADDRESS_FILE) {
    console.error("Missing ADDRESS_FILE. Aborting..");
    return null;
  }
  const connection = {
    url:url,
    headers: { "User-Agent" : "Soon Huat Deployer"}
  };
  const provider = new ethers.providers.StaticJsonRpcProvider(connection);
  const network = provider.getNetwork();
  // utils
  const networkDetails = await network;


  let wallet;
  if (process.env.MNEMONIC)
    wallet = new Wallet.fromMnemonic(process.env.MNEMONIC);
  if (process.env.PRIVATE_KEY) wallet = new Wallet(process.env.PRIVATE_KEY);
  if (!wallet) {
    console.error("Missing MNEMONIC or PRIVATE_KEY. Aborting..");
    return null;
  }
  owner = wallet.connect(provider);
  //let OPFOwner = '0x7DF5273aD9A6fCce64D45c64c1E43cfb6F861725';
  let OPFOwner = null;
  let routerOwner = null
  let OPFCommunityFeeCollectorAddress;
  let productionNetwork = false;
  let OceanTokenAddress;
  let gasLimit = 8000000;
  let gasPrice = null;
  let sleepAmount = 10;
  let additionalApprovedTokens = []
  console.log("Using chain " + networkDetails.chainId);
  const networkName = "polygonedge";

  let options
  if (gasPrice) {
    options = { gasLimit: gasLimit, gasPrice: gasPrice }
  }
  else {
    options = { gasLimit }
  }
  const addressFile = process.env.ADDRESS_FILE;
  let oldAddresses;
  if (addressFile) {
    try {
      oldAddresses = JSON.parse(fs.readFileSync(addressFile));
    } catch (e) {
      console.log(e);
      oldAddresses = {};
    }
    if (!oldAddresses[networkName]) oldAddresses[networkName] = {};
    addresses = oldAddresses[networkName];
  }
  if (logging)
    console.info(
      "Use existing addresses:" + JSON.stringify(addresses, null, 2)
    );

  addresses.chainId = networkDetails.chainId;
  if (logging) console.info("Deploying OceanToken");
  const Ocean = await ethers.getContractFactory("Stablecoin", owner);
  const ocean = await Ocean.connect(owner).deploy("USD Coin", "USDC", 6, options);
  await ocean.deployTransaction.wait();
  addresses.Ocean = ocean.address;
  if (show_verify) {
    console.log("\tRun the following to verify on etherscan");
    console.log("\tnpx hardhat verify --network " + networkName + " " + ocean.address + " " + owner.address)
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
