import { useEffect, useState } from 'react'
import { shortenEthAddress, shortenEthDynamic } from '../../utils/utils'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { Button } from '../../components/ui/button'
import { useSwapModal } from '../../context/swap-modal-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import CustomHomeIcon from './CustomHomeIcon'

export default function Header() {
	const [currentPrice, setCurrentPrice] = useState(0.0)

	const { open } = useAppKit()

	const { address, isConnected } = useAppKitAccount()
	const { openModal } = useSwapModal()

	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS

	useEffect(() => {
		const fetchData = async () => {
			const tokenDataRes = await fetch(
				`https://api.geckoterminal.com/api/v2/networks/hyperevm/tokens/${tokenAddress}`
			)
			const tokenDataJson = await tokenDataRes.json()
			setCurrentPrice(parseFloat(tokenDataJson.data.attributes.price_usd))
		}
		fetchData()

		const interval = setInterval(async () => {
			const tokenDataRes = await fetch(
				`https://api.geckoterminal.com/api/v2/networks/hyperevm/tokens/${tokenAddress}`
			)
			const tokenDataJson = await tokenDataRes.json()
			setCurrentPrice(parseFloat(tokenDataJson.data.attributes.price_usd))
		}, 10000)

		return () => clearInterval(interval)
	}, [tokenAddress])

	const currentPath = usePathname()

	return (
		<header className='fixed top-0 left-0 right-0 z-9999 bg-teal-950/30 backdrop-blur-sm border-b border-teal-900/20 pointer-events-none '>
			<div className='container mx-auto px-6 py-4 flex items-center justify-between pointer-events-auto'>
				<div className='flex items-center gap-3'>
					<Link href='/' className='text-xl font-bold text-white tracking-wider flex'>
						{/* Icon Home */}
						<CustomHomeIcon className='mr-2' />
						HYRSTR
					</Link>
					<button
						className='flex items-center gap-2 bg-teal-900/30 px-3 py-1 rounded-full'
						onClick={() => (currentPath != '/' ? openModal() : undefined)}>
						<span className='text-teal-400 text-sm'>
							${shortenEthDynamic(currentPrice.toString(), 8)}
						</span>
						{currentPath != '/' && (
							<span className='px-2 py-0.5 bg-teal-600 text-white text-xs font-semibold rounded cursor-pointer'>
								SWAP
							</span>
						)}
					</button>
				</div>
				{currentPath == '/' && (
					<Button
						className='px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/50 transition-all cursor-pointer'
						onClick={() => (window.location.href = '/app')}>
						Enter App
					</Button>
				)}
				{currentPath != '/' &&
					(isConnected ? (
						<Button
							className='text-foreground transition-colors cursor-pointer border border-primary/20 px-2 py-1 rounded-md text-sm font-semibold bg-transparent'
							onClick={() => open()}>
							{shortenEthAddress(address || '')}
						</Button>
					) : (
						<Button
							className='px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-teal-500/50 transition-all cursor-pointer'
							onClick={() => open()}>
							Connect Wallet
						</Button>
					))}
			</div>
		</header>
	)
}
