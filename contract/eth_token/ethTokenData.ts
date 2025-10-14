import { ChainId, Token } from '@uniswap/sdk-core'
import { isMainnet } from '../../constants/constants'

export const ETH_TOKEN_ADDRESS = '0x5555555555555555555555555555555555555555'

export const ETH_TOKEN = new Token(
	isMainnet ? ChainId.MAINNET : ChainId.SEPOLIA,
	ETH_TOKEN_ADDRESS,
	18,
	'HYPE',
	'Hype'
)
