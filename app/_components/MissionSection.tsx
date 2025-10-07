import { ExternalLink } from 'lucide-react'
import { NFTData } from '../api/nft/holding/route'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MissionSection() {
	const [currentHoldings, setCurrentHoldings] = useState<NFTData[]>([])

	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS

	useEffect(() => {
		const fetchData = async () => {
			const nftsHoldingRes = await fetch(
				`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}`
			)
			const nftsHoldingJson = await nftsHoldingRes.json()
			setCurrentHoldings(nftsHoldingJson.data)
		}
		fetchData()

		// const interval = setInterval(async () => {
		// 	const nftsHoldingRes = await fetch(
		// 		`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}`
		// 	)
		// 	const nftsHoldingJson = await nftsHoldingRes.json()
		// 	setCurrentHoldings(nftsHoldingJson)
		// }, 10000)

		// return () => clearInterval(interval)
	}, [nftAddress, tokenAddress])

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
					{['All', 'Unique', 'Rare', 'Best'].map((tab) => (
						<button
							key={tab}
							className={`px-6 py-3 rounded-lg font-semibold transition-all ${
								tab === 'All'
									? 'bg-teal-500 text-white'
									: 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
							}`}>
							{tab}
						</button>
					))}
				</div>

				{/* Character grid */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
					{currentHoldings &&
						currentHoldings.length > 0 &&
						currentHoldings.map((collection, index) => (
							<div
								key={index}
								className='group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/20 hover:border-teal-400/60 transition-all hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20'>
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
							</div>
						))}
				</div>

				{/* Mystery card */}
				<div className='max-w-xs mx-auto'>
					<div className='relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/20'>
						<div className='aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden'>
							<div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse'></div>
							<div className='w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-2xl font-bold'>
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
