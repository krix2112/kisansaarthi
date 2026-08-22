import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ProofRegistry contract to Shardeum EVM testnet...");
  
  // TODO: Deploy contract to Shardeum network
  const ProofRegistry = await ethers.getContractFactory("ProofRegistry");
  // const proofRegistry = await ProofRegistry.deploy();
  // await proofRegistry.waitForDeployment();

  console.log("ProofRegistry deployment stub executed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
