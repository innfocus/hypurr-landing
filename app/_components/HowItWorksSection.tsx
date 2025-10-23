import { ShoppingCart, TrendingUp, Wallet, Users } from 'lucide-react'

export default function HowItWorks() {
	const steps = [
		{
			icon: ShoppingCart,
			title: '10% of each trade of $HYRSTR is taken as a fee and stored in the protocol (minus 0.5% rake to $PNKSTR)',
			step: '01',
		},
		{
			icon: Users,
			title: "When there's enough fees in the pool, the machine buys a floor Hypurr",
			step: '02',
		},
		{
			icon: TrendingUp,
			title: 'The Hypurr automatically gets listed for 1.1x-1.2x the price',
			step: '03',
		},
		{
			icon: Wallet,
			title: 'When the Hypurr is sold, all of the HYPE buys and burns $HYRSTR or is added to the liquidity pool.',
			step: '04',
		},
	]

	return (
		<section className='relative py-32 px-6 mb-12 ' id='how-it-works'>
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-5xl md:text-6xl font-black text-center mb-4 text-white'>
					How It Works
				</h2>
				<p className='text-center text-slate-400 text-lg mb-20'>
					The automated process that drives value
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{steps.map((step, index) => {
						const Icon = step.icon
						return (
							<div key={index} className='relative group'>
								{/* Connecting line */}
								{index < steps.length - 1 && (
									<div className='hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-teal-400/50 to-transparent'></div>
								)}

								<div className='relative bg-slate-800/50 backdrop-blur-sm rounded-2xl px-8 py-4 border border-teal-400/20 hover:border-teal-400/60 transition-all hover:shadow-xl hover:shadow-teal-500/20  md:h-64 flex flex-col justify-between items-center'>
									{/* Step number */}
									<div className='absolute -top-4 right-0 left-0 mx-auto w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg'>
										{step.step}
									</div>

									{/* Description */}
									<p className='text-slate-300 leading-relaxed text-sm mt-6 font-bold mb-4'>
										{step.title}
									</p>

									{/* Icon */}
									<div className='w-16 h-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform'>
										<Icon className='w-8 h-8 text-teal-400' />
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
