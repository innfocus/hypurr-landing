import { useEffect, useState } from 'react'
import { shortenEthDynamic } from '../../utils/utils'

export default function Header() {
	const [currentPrice, setCurrentPrice] = useState(0.0)

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

	return (
		<header className='fixed top-0 left-0 right-0 z-40 bg-teal-950/30 backdrop-blur-sm border-b border-teal-900/20'>
			<div className='container mx-auto px-6 py-4 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<h1 className='text-xl font-bold text-white tracking-wider'>$HYPSTR</h1>
					<div className='flex items-center gap-2 bg-teal-900/30 px-3 py-1 rounded-full'>
						<span className='text-teal-400 text-sm'>
							${shortenEthDynamic(currentPrice.toString(), 4)}
						</span>
						<span className='px-2 py-0.5 bg-teal-600 text-white text-xs font-semibold rounded'>
							BUY
						</span>
					</div>
				</div>
			</div>
		</header>
	)
}
