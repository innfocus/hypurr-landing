import { ChainId, Token } from '@uniswap/sdk-core'
import { isMainnet } from '../../constants/constants'

export const ETH_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ETH_TOKEN = new Token(
	isMainnet ? ChainId.MAINNET : ChainId.SEPOLIA,
	ETH_TOKEN_ADDRESS,
	18,
	'ETH',
	'Ether'
)
