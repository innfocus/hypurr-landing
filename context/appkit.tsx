'use client'

import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import {
	defineChain,
	hyperliquidEvmTestnet,
} from '@reown/appkit/networks'
import { AppKitProvider } from '@reown/appkit/react'

const reownid = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const IS_MAINNET = process.env.NEXT_PUBLIC_IS_MAINNET === 'true'

const hyperliquidNetwork = defineChain({
	id: 999,
	name: 'Hyperliquid EVM',
	nativeCurrency: {
		name: 'HYPE',
		symbol: 'HYPE',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.hyperliquid.xyz/evm'],
		},
	},
	chainNamespace: 'eip155',
	caipNetworkId: 'eip155:999',
	testnet: false,
})

const reownMetadata = {
	name: 'HypurrStrategy',
	description:
		'Enter the Hypurr universe. Premium NFT collection featuring futuristic avatars and digital identity.',
	url: 'https://hyperfoundation.org/',
	icons: ['https://hyperfoundation.org/apple-touch-icon.png'],
}

export function AppKitContext({ children }: { children: React.ReactNode }) {
	return (
		<AppKitProvider
			adapters={[new EthersAdapter()]}
			metadata={reownMetadata}
			networks={[IS_MAINNET ? hyperliquidNetwork : hyperliquidEvmTestnet]}
			projectId={reownid || ''}
			chainImages={{
				999: '/hyper_liquid_icon.svg',
				998: '/hyper_liquid_icon.svg',
			}}
			features={{
				analytics: true,
			}}>
			{children}
		</AppKitProvider>
	)
}
