import { NFTData } from '../api/nft/holding/route'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NFTResult } from '../api/nft/cheapest/route'
import { SoldNFT } from '../api/nft/sold/route'
import { shortenEthBalance } from '../../utils/utils'

interface MissionSectionProps {
	cheapestNft: NFTResult | null
}

export default function MissionSection({ cheapestNft }: MissionSectionProps) {
	const [currentHoldings, setCurrentHoldings] = useState<NFTData[]>([])
	const [nftsList, setNftsList] = useState<NFTData[] | SoldNFT[]>([])
	const [soldNfts, setSoldNfts] = useState<SoldNFT[]>([])
	const [visibleItems, setVisibleItems] = useState<number[]>([])
	const [isAnimating, setIsAnimating] = useState(false)

	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS

	const [tab, setTab] = useState('all')

	useEffect(() => {
		const fetchData = async () => {
			const nftsHoldingRes = await fetch(
				`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}`
			)
			const nftsHoldingJson = await nftsHoldingRes.json()
			setCurrentHoldings(nftsHoldingJson.data)
			setNftsList(nftsHoldingJson.data)
		}
		fetchData()
	}, [nftAddress, tokenAddress])

	useEffect(() => {
		const fetchSoldNfts = async () => {
			const soldNftsRes = await fetch('/api/nft/sold')
			const soldNftsJson = await soldNftsRes.json()
			setSoldNfts(soldNftsJson.data)
		}
		fetchSoldNfts()
	}, [])

	useEffect(() => {
		// Clear visible items and start animation
		setVisibleItems([])
		setIsAnimating(true)

		// Wait for fade out, then update content
		setTimeout(() => {
			let results: NFTData[] | SoldNFT[] = []

			if (tab === 'all') {
				results = currentHoldings || []
			}

			if (tab === 'listing') {
				results = (currentHoldings || []).filter((nft) => nft.type === 'listing')
			}

			if (tab === 'vault') {
				results = (currentHoldings || []).filter((nft) => nft.type === 'sale')
			}

			if (tab === 'sold') {
				results = soldNfts || []
			}

			setNftsList(results)

			// Start step-by-step animation
			setIsAnimating(false)

			// Animate each item one by one (only if results is not empty)
			if (results && results.length > 0) {
				results.forEach((_, index) => {
					setTimeout(() => {
						setVisibleItems((prev) => [...prev, index])
					}, index * 150) // 150ms delay between each item
				})
			}
		}, 300)
	}, [tab, currentHoldings])

	return (
		<section className='relative py-32 px-6' id='mission'>
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-5xl md:text-6xl font-black text-center mb-4 text-white'>
					The Mission: Buy and Sell Hypurr
				</h2>
				<p className='text-center text-slate-400 text-lg mb-16'>
					Complete collection overview
				</p>

				{/* Rarity tabs */}
				<div className='flex justify-center gap-2 mb-12'>
					{['All', 'Listing', 'Vault', 'Sold'].map((tabName: string) => (
						<button
							key={tabName}
							onClick={() => setTab(tabName.toLowerCase())}
							className={`px-6 py-3 rounded-lg font-semibold transition-all ${
								tab === tabName.toLowerCase()
									? 'bg-teal-500 text-white'
									: 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
							}`}>
							{tabName}
						</button>
					))}
				</div>

				{/* Character grid */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
					{nftsList &&
						nftsList.length > 0 &&
						nftsList.map((collection: NFTData | SoldNFT, index: number) => {
							const isVisible = visibleItems.includes(index)
							const isAnimatingOut = isAnimating

							return (
								<div
									key={`${tab}-${collection.tokenId || index}`}
									className={`group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/20 hover:border-teal-400/60 transition-all duration-700 ease-out hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 ${
										isAnimatingOut
											? 'opacity-0 translate-y-8 scale-95'
											: isVisible
											? 'opacity-100 translate-y-0 scale-100'
											: 'opacity-0 translate-y-8 scale-95'
									}`}>
									<div
										className={`aspect-square bg-gradient-to-br rounded-xl mb-4 flex items-center justify-center text-6xl font-black text-white/20 relative overflow-hidden`}>
										<Image
											src={collection.image || '/placeholder.svg'}
											alt={collection.name}
											fill
											className='object-cover'
											sizes='(max-width: 768px) 50vw, 25vw'
										/>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-slate-300 font-semibold'>
											{collection.name}
										</span>
										<Link
											href={collection.openseaLink || ''}
											target='_blank'
											rel='noopener noreferrer'>
											<svg
												className='w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
												/>
											</svg>
										</Link>
									</div>
									{(tab === 'listing' || tab === 'sold') && (
										<div className='text-slate-500 text-sm'>
											{'listingPrice' in collection
												? `Listed for: ${shortenEthBalance(
														collection.listingPrice || '0'
												  )} HYPE`
												: `Sold for: ${shortenEthBalance(
														(collection as SoldNFT).soldPrice || '0'
												  )} HYPE`}
										</div>
									)}
								</div>
							)
						})}
				</div>

				{/* Mystery card */}
				<div className='max-w-xs mx-auto'>
					<div className='relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/20 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-700 ease-out'>
						<div className='aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden'>
							{cheapestNft && (
								<div
									className='absolute inset-0 bg-cover bg-center blur-sm'
									style={{
										backgroundImage: `url(${cheapestNft.image})`,
									}}></div>
							)}
							<div className='absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80'></div>
							<div className='relative z-10 w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-2xl font-bold'>
								?
							</div>
						</div>
						<div className='text-center'>
							<span className='text-slate-400 text-sm'>??????</span>
							<p className='text-xs text-slate-500 mt-1'>
								444.69 HYPE until next purchase
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
