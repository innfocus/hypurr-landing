'use client'

export function HowItWorksSection() {
	const steps = [
		{
			number: 'Step 1',
			title: 'Fee Collection',
			description: (
				<>
					<span className='block'>
						10% of each trade of $MKFSTR is taken as a fee and stored in the protocol
					</span>

					<span className='block'>• 8% to Treasury</span>
					{/* <span className='block'>• 1% to Buy and Burn</span>
					<span className='block'>
						{' '}
						<a
							href='https://www.geckoterminal.com/eth/pools/0x4a61c5bd0c16a68206921f8a9aa7892b1a1b0daf9ec942ff3f126f234c0ebec4'
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary underline hover:text-primary/80'>
							Murakami.Flower REVIVAL (MKFSTR-R)
						</a>
					</span> */}
					<span className='block'>• 2% Buy and Burn</span>
					<span className='block'>
						{' '}
						<a
							href='https://www.geckoterminal.com/eth/pools/0xbdb0f9c31367485f85e691f638345f3de673a78effaff71ce34bc7ff1d54fddc'
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary underline hover:text-primary/80'>
							$PNKSTR
						</a>
					</span>
				</>
			),
			icon: '💰',
		},
		{
			number: 'Step 2',
			title: 'Floor Murakami.Flower Purchase',
			description:
				"When there's enough fees in the pool, the machine buys a floor Murakami.Flower",
			icon: '🤖',
		},
		{
			number: 'Step 3',
			title: 'Auto Listing',
			description: 'The Murakami.Flower automatically gets listed for 1.2x the price',
			icon: '📈',
		},
		{
			number: 'Step 4',
			title: 'Buy & Burn',
			description: (
				<>
					<span className='block'>
						When the Murakami.Flower is sold, all of the ETH buys and burns $MKFSTR
					</span>

					<span className='block'>&</span>
					{/* <span className='block'>• 1% Buy and Burn</span>
					<span className='block'>
						{' '}
						<a
							href='https://www.geckoterminal.com/eth/pools/0x4a61c5bd0c16a68206921f8a9aa7892b1a1b0daf9ec942ff3f126f234c0ebec4'
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary underline hover:text-primary/80'>
							Murakami.Flower REVIVAL (Murakami.Flower-R)
						</a>
					</span>
					<span className='block'>on the Solana chain.</span> */}

					<span className='block'>• 2% Buy and Burn</span>
					<span className='block'>
						{' '}
						<a
							href='https://www.geckoterminal.com/eth/pools/0xbdb0f9c31367485f85e691f638345f3de673a78effaff71ce34bc7ff1d54fddc'
							target='_blank'
							rel='noopener noreferrer'
							className='text-primary underline hover:text-primary/80'>
							$PNKSTR
						</a>
					</span>
				</>
			),
			icon: '🔥',
		},
	]

	return (
		<section id='how-it-works' className='py-20 px-4 relative overflow-hidden '>
			<div className='max-w-[1600px] mx-auto relative z-10'>
				{/* Header */}
				<div className='text-center mb-16'>
					<h2 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
						How It Works
					</h2>
					<p className='text-xl text-title-text-color-100 max-w-3xl mx-auto text-pretty'>
						The autonomous protocol that turns trading fees into Murakami.Flower
						acquisitions and burns $MKFSTR forever
					</p>
				</div>
				 {/* Steps Grid */}
				<div className='grid grid-cols-1 md:grid-cols-4 md:gap-8 gap-20 '>
					{steps.map((step, index) => (
						<div key={index} className='group'>
							{/* Step Card */}
							<div className=' border border-primary/30 rounded-2xl p-6 pb-0 h-full transition-all duration-300 group-hover:border-primary/50 bg-card-primary backdrop-blur-sm'>
								{/* Content */}
								<h3 className='text-xl font-bold text-foreground mb-3 text-center'>
									{step.title}
								</h3>
								<p className='text-foreground text-center text-sm leading-relaxed'>
									{step.description}
								</p>

								{/* Hover Effect */}
								<div className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
							</div>

							<div className='flex items-center justify-center w-36 border-primary/30 border rounded-md text-foreground text-lg py-4 mb-2 md:mb-4 mx-auto mt-2 md:mt-4 font-semibold bg-card-primary backdrop-blur-sm'>
								{step.number}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
