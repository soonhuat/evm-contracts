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


async function main() {
  const url = process.env.NETWORK_RPC_URL;
  console.log("Using RPC: " + url);
  if (!url) {
    console.error("Missing NETWORK_RPC_URL. Aborting..");
    return null;
  }
  const connection = {
    url:url,
    headers: { "User-Agent" : "Soon Huat Minter"}
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
  const signer = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    provider
);
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
  
  if (logging) console.info("Mint stablecoin USDC");
  const coinContract = await ethers.getContractAt("Stablecoin", "0xD1cebf9fD739Ac932bC3fe37D8fDEe88A5d3dDce", signer);
  const result = await coinContract.mint("0x972056A76c18712cD0ee76a257e96cD8e4e32836", 10000);
  console.log(result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
