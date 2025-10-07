'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, DollarSign, Users, Zap } from 'lucide-react'

export function TokenomicsSection() {
	const [marketCap, setMarketCap] = useState('$0')
	const [price, setPrice] = useState('$0.00')
	const [holders, setHolders] = useState('0')

	// Simulate fetching real-time data
	useEffect(() => {
		const fetchTokenData = () => {
			// Mock data - in real app, fetch from API
			setMarketCap('$12.5M')
			setPrice('$0.0125')
			setHolders('8,432')
		}

		fetchTokenData()
		const interval = setInterval(fetchTokenData, 30000) // Update every 30s

		return () => clearInterval(interval)
	}, [])

	return (
		<section className='py-20 px-4 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background/90 to-accent/5 backdrop-blur-sm'>
			<div className='absolute top-16 left-8 w-36 h-36 float-animation'>
				<img
					src='/tech-ninja-cyberpunk-avatar.jpg'
					alt='CloneX Character'
					className='w-full h-full rounded-full red-glow opacity-70'
				/>
			</div>

			<div className='absolute bottom-16 right-8 w-44 h-44 float-animation-delayed'>
				<img
					src='/futuristic-cyberpunk-avatar-with-neon-glow.jpg'
					alt='CloneX Character'
					className='w-full h-full rounded-full gold-glow opacity-60'
				/>
			</div>

			<div className='container mx-auto relative z-10'>
				<div className='text-center mb-16'>
					<h2 className='text-5xl md:text-6xl font-bold mb-6 text-foreground drop-shadow-2xl'>
						CLXSTR TOKEN
					</h2>
					<p className='text-xl text-foreground-100 max-w-3xl mx-auto leading-relaxed'>
						The native utility token powering the CloneX ecosystem. Stake, trade, and
						unlock exclusive benefits.
					</p>
				</div>

				{/* Token Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 mx-24'>
					<Card className='border-red-500/30 hover:border-red-500/60 transition-all duration-300 group'>
						<CardContent className='p-6 text-center'>
							<div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
								<DollarSign className='w-6 h-6 text-white' />
							</div>
							<h3 className='text-2xl font-bold text-white mb-2'>{price}</h3>
							<p className='text-gray-200'>Current Price</p>
							<div className='flex items-center justify-center mt-2 text-green-400'>
								<TrendingUp className='w-4 h-4 mr-1' />
								<span className='text-sm'>+12.5%</span>
							</div>
						</CardContent>
					</Card>

					<Card className='border-gold/30 hover:border-gold/60 transition-all duration-300 group'>
						<CardContent className='p-6 text-center'>
							<div className='w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
								<TrendingUp className='w-6 h-6 text-black' />
							</div>
							<h3 className='text-2xl font-bold text-white mb-2'>{marketCap}</h3>
							<p className='text-gray-200'>Market Cap</p>
							<div className='flex items-center justify-center mt-2 text-gold'>
								<Zap className='w-4 h-4 mr-1' />
								<span className='text-sm'>Live</span>
							</div>
						</CardContent>
					</Card>

					<Card className='border-red-500/30 hover:border-red-500/60 transition-all duration-300 group'>
						<CardContent className='p-6 text-center'>
							<div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
								<Users className='w-6 h-6 text-white' />
							</div>
							<h3 className='text-2xl font-bold text-white mb-2'>{holders}</h3>
							<p className='text-gray-200'>Token Holders</p>
							<div className='flex items-center justify-center mt-2 text-blue-400'>
								<TrendingUp className='w-4 h-4 mr-1' />
								<span className='text-sm'>Growing</span>
							</div>
						</CardContent>
					</Card>

					<Card className='border-gold/30 hover:border-gold/60 transition-all duration-300 group'>
						<CardContent className='p-6 text-center'>
							<div className='w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
								<Zap className='w-6 h-6 text-black' />
							</div>
							<h3 className='text-2xl font-bold text-white mb-2'>1B</h3>
							<p className='text-gray-200'>Total Supply</p>
							<div className='flex items-center justify-center mt-2 text-gray-500'>
								<span className='text-sm'>Fixed</span>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='text-center'>
					<Button
						size='lg'
						className='bg-primary hover:bg-primary/90 text-primary-foreground red-glow'>
						Buy CLXSTR
					</Button>
				</div>
			</div>
		</section>
	)
}
