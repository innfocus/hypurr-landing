import { SwapExactInSingle } from '@uniswap/v4-sdk'
import { Contract, formatUnits, JsonRpcProvider, parseUnits } from 'ethers'
import { RPC_URL } from '../../constants/constants'
import { ETH_TOKEN } from '../eth_token/ethTokenData'
import { TOKEN_INFO } from '../token/tokenData'

import routerABI from "../abi/hyperswap_router_V2.json";
const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_V2_ROUTER_ADDRESS || ''

// Token Addresses
const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || ''
const WETH_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || ''

export interface QuoterInteraction {
	getExactAmountIn: (amountIn: string, hooks: string, zeroForOne: boolean) => Promise<string>
}

export interface GetSwapExactInSingleParams {
	amountIn: string
	hooks: string
	zeroForOne?: boolean
	amountOutMinimum?: string
}

export class QuoterContract {
	private contract: Contract

	constructor() {
		const provider = new JsonRpcProvider(RPC_URL)
		this.contract = new Contract(ROUTER_ADDRESS, routerABI.abi, provider)
	}

	getSwapExactInSingle({
		amountIn,
		hooks,
		zeroForOne = true,
		amountOutMinimum = '0',
	}: GetSwapExactInSingleParams): SwapExactInSingle {
		const amountInBigInt = parseUnits(amountIn, ETH_TOKEN.decimals)

		return {
			poolKey: {
				currency0: ETH_TOKEN.address,
				currency1: TOKEN_INFO.address,
				fee: 0,
				tickSpacing: 60,
				hooks: hooks,
			},
			zeroForOne: zeroForOne,
			amountIn: amountInBigInt.toString(),
			amountOutMinimum: amountOutMinimum,
			hookData: '0x0000000000000000000000000000000000000000',
		}
	}

	async getExactAmountIn({
		amountIn,
		zeroForOne,
	}: {
		amountIn: string
		zeroForOne: boolean
	}): Promise<string> {
		try {
			const amountInParsed = parseUnits(amountIn, 18);
			let path;
			if (zeroForOne) {
				path = [WETH_ADDRESS, TOKEN_ADDRESS];
			} else {
				path = [TOKEN_ADDRESS, WETH_ADDRESS];
			}

			const amounts = await this.contract.getAmountsOut(amountInParsed, path);
			return formatUnits(amounts[1], 18);
		} catch (error) {
			console.error('Error getting exact amount in:', error)
			return '0'
		}
	}
}
