// Hyperswap V2 SDK - Swap Functions

import { Contract, BrowserProvider, JsonRpcSigner, isAddress, parseEther, ZeroAddress, parseUnits } from "ethers";

import routerABI from "./abi/hyperswap_router_V2.json";
import type { Hyperswap_router_V2 } from '../typechain-types';

// Router Contract Address
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_V2_ROUTER_ADDRESS || ''

// Initialize Router Contract
const getRouterContract = (provider: any) => {
  return new Contract(ROUTER_ADDRESS, routerABI.abi, provider) as unknown as Hyperswap_router_V2;
};

// Token Addresses
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || ''
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || ''

// Swap ETH for TOKEN (Buy)
async function swapETHForToken(provider: BrowserProvider, signer: JsonRpcSigner, amountOutMin: string, to: string | undefined, ethAmount: string) {
  console.log("Starting swapETHForToken...");

  // Validate the recipient address
  if (!isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const router = getRouterContract(provider).connect(signer);

  // Use an integer for the deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  const path = [WETH_ADDRESS, TOKEN_ADDRESS];

  // Validate addresses in path
  path.forEach((address) => {
    if (!isAddress(address)) {
      throw new Error(`Invalid address in path: ${address}`);
    }
  });

  const ethAmountParsed = parseEther(ethAmount.toString());

  // Use AddressZero as the referrer
  const referrer = ZeroAddress;
  const amountOutMinParsed = parseUnits(amountOutMin, 18);

  // Call the function with the corrected arguments
  const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountOutMinParsed,
    path,
    to,
    referrer, // Add the referrer argument
    deadline, // Pass the deadline
    { value: ethAmountParsed }
  );

  return tx.wait();
}

// Swap TOKEN for ETH (Sell)
async function swapTokenForETH(provider: any, signer: any, amountIn: any, slippageTolerance: number, to: any) {
  console.log("Starting swapTokenForETH...");

  // Validate the recipient address
  if (!isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const router = getRouterContract(provider).connect(signer);

  // Calculate the expected amount of ETH
  const path = [TOKEN_ADDRESS, WETH_ADDRESS]; // TOKEN → ETH
  const amountInParsed = parseUnits(amountIn, 18);

  const amountsOut = await router.getAmountsOut(amountInParsed, path);
  const expectedETH = amountsOut[1];

  // Apply slippage tolerance
  const slippageFactor =
    (BigInt(100 - slippageTolerance) * parseUnits("1", 18)) / 100n;
  const amountOutMin = (expectedETH * slippageFactor) / parseUnits("1", 18);

  // Use an integer for the deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Approve the router to spend TOKEN (if not already approved)
  const tokenContract = new Contract(
    TOKEN_ADDRESS, // TOKEN address
    [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ],
    signer
  );
  console.log("Approving TOKEN...");
  await tokenContract.approve(router.target, amountInParsed);

  console.log("TOKEN approved. Proceeding with swap...");

  // Perform the swap
  const referrer = ZeroAddress;

  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountInParsed,
    amountOutMin, // Calculated dynamically
    path,
    to,
    referrer,
    deadline
  );

  return tx.wait();
}

export {
  swapETHForToken,
  swapTokenForETH
};
