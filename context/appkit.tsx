'use client'

import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import {
	defineChain,
	hychain,
	hyperliquidEvmTestnet,
	mainnet,
	sepolia,
} from '@reown/appkit/networks'
import { AppKitProvider, createAppKit } from '@reown/appkit/react'

const reownid = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

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
})

const hyperliquidTestnetNetwork = defineChain({
	id: 998,
	name: 'Hyperliquid EVM',
	nativeCurrency: {
		name: 'HYPE',
		symbol: 'HYPE',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.hyperliquid-testnet.xyz/evm'],
		},
	},
	chainNamespace: 'eip155',
	caipNetworkId: 'eip155:998',
})

const reownMetadata = {
	name: 'CloneX',
	description:
		'Enter the CloneX universe. Premium NFT collection featuring futuristic avatars and digital identity.',
	url: 'https://clonex.revival.com',
	icons: ['https://avatars.mywebsite.com/'],
}

export function AppKitContext({ children }: { children: React.ReactNode }) {
	return (
		<AppKitProvider
			adapters={[new EthersAdapter()]}
			metadata={reownMetadata}
			networks={[hyperliquidNetwork]}
			projectId={reownid || ''}
			chainImages={{
				999: '/hyper_liquid_icon.svg',
			}}
			features={{
				analytics: true,
			}}>
			{children}
		</AppKitProvider>
	)
}
