'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { NFTData } from '../app/api/nft/holding/route'

export function CollectionShowcase() {
	const [hoveredCard, setHoveredCard] = useState<number | null>(null)

	const [nfts, setNfts] = useState<NFTData[]>([])

	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS
	const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS

	useEffect(() => {
		const fetchNfts = async () => {
			const response = await fetch(
				`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}&limit=10`
			)
			const data = await response.json()
			setNfts(data)
		}

		fetchNfts()
	}, [])

	return (
		<section id='collection' className='py-24 relative overflow-hidden'>
			<div className='container mx-auto px-4 relative z-10'>
				<div className='text-center mb-16'>
					<h2 className='text-2xl md:text-6xl font-bold mb-1 text-foreground'>
						The mission:
					</h2>
					<h2 className='text-xl md:text-6xl font-bold mb-6 text-foreground'>
						<span className='text-primary'>
							Buy and Sell <span className='text-md'>Murakami.Flower</span>
						</span>
					</h2>
					<p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty'>
						So far, the machine has bought and sold these Murakami.Flowers:
					</p>
				</div>

				<div className='grid grid-cols-2 md:grid-cols-8 gap-4 px-4 md:px-24'>
					{nfts &&
						nfts.length > 0 &&
						nfts.map((nft, index) => (
							<div key={nft.tokenId}>
								<Card
									className='bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group py-2 gap-2'
									onMouseEnter={() => setHoveredCard(index)}
									onMouseLeave={() => setHoveredCard(null)}>
									<div className='relative flex justify-center items-center'>
										<img
											src={nft.image || '/placeholder.svg'}
											alt={nft.name}
											className='w-32 object-cover transition-transform duration-300 group-hover:scale-110 rounded-md'
										/>
									</div>

									<CardContent className=''>
										<div className='flex justify-between items-center flex-col'>
											<h3 className='text-shadow-lg text-foreground text-center text-[10px]'>
												{nft.name}
											</h3>

											{nft.lastSalePrice && (
												<span className='text-lg font-bold text-primary mt-1.5'>
													{nft.lastSalePrice} ETH
												</span>
											)}
										</div>
									</CardContent>
								</Card>
							</div>
						))}
				</div>

				<div className='text-center mt-12'>
					<Link href='/app'>
						<Button
							size='lg'
							className='bg-primary hover:bg-primary/90 text-primary-foreground red-glow'>
							Get Started
						</Button>
					</Link>
				</div>
			</div>
		</section>
	)
}
