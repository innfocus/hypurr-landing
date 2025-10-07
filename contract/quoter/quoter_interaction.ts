import { SwapExactInSingle } from '@uniswap/v4-sdk'
import { Contract, formatUnits, JsonRpcProvider, parseUnits } from 'ethers'
import { RPC_URL } from '../../constants/constants'
import { ETH_TOKEN } from '../eth_token/ethTokenData'
import { TOKEN_INFO } from '../token/tokenData'
import { QUOTER_ABI, QUOTER_ADDRESS } from './quoter_data'

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
		this.contract = new Contract(QUOTER_ADDRESS, QUOTER_ABI, provider)
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
		hooks,
		zeroForOne,
	}: {
		amountIn: string
		hooks: string
		zeroForOne: boolean
	}): Promise<string> {
		try {
			const currentConfig = this.getSwapExactInSingle({
				amountIn,
				hooks,
				zeroForOne,
			})

			const quotedAmount = await this.contract.quoteExactInputSingle.staticCall({
				poolKey: currentConfig.poolKey,
				zeroForOne: currentConfig.zeroForOne,
				exactAmount: currentConfig.amountIn,
				hookData: currentConfig.hookData,
			})

			return formatUnits(quotedAmount.amountOut, TOKEN_INFO.decimals)
		} catch (error) {
			console.error('Error getting exact amount in:', error)
			return '0'
		}
	}
}
