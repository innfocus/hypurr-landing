import { Token } from '@uniswap/sdk-core'
import { isMainnet } from '../../constants/constants'

export const ETH_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_WETH_ADDRESS || ''

export const ETH_TOKEN = new Token(
	isMainnet ? 999 : 998,
	ETH_TOKEN_ADDRESS,
	18,
	'HYPE',
	'Hype'
)
