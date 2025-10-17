import { ShoppingCart, TrendingUp, Wallet, Users } from 'lucide-react'

export default function HowItWorks() {
	const steps = [
		{
			icon: ShoppingCart,
			title: '50% of each "sale" of $HYRSTR is diverted to the protocol to buy 8.5% sale to HYPE.',
			step: '01',
		},
		{
			icon: Users,
			title: "When there's enough fees in the pool, the protocol buys 1 from HYPE",
			step: '02',
		},
		{
			icon: TrendingUp,
			title: 'The Hypurr automatically gets listed for 1.5x the price.',
			step: '03',
		},
		{
			icon: Wallet,
			title: 'When the Hypurr is sold, all of the selling funds and excess $HYRSTR.',
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

								<div className='relative bg-slate-800/50 backdrop-blur-sm rounded-2xl px-8 py-4 border border-teal-400/20 hover:border-teal-400/60 transition-all hover:shadow-xl hover:shadow-teal-500/20 h-64 flex flex-col justify-between items-center'>
									{/* Step number */}
									<div className='absolute -top-4 right-0 left-0 mx-auto w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg'>
										{step.step}
									</div>

									{/* Icon */}

									{/* Description */}
									<p className='text-slate-300 leading-relaxed text-sm mt-6 font-bold'>
										{step.title}
									</p>

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
