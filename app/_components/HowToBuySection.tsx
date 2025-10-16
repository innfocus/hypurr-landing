import { ExternalLink } from 'lucide-react'

export default function HowToBuySection() {
	const methods = [
		{
			title: 'Bridge $HYPE tokens to HypurrVM',
			description:
				'via ethereum_bridge, deBridge, Synapse, to manually exchange swap.hype.foundation',
			links: ['ethereum_bridge', 'deBridge', 'Synapse', 'swap.hype.foundation'],
		},
		{
			title: 'Swap through Ooombea Trading',
			description:
				'OR was.foundation.exchange OR Meson for Interoperability-Ensure $8STR/ETH is in your Metamask (HYPE EVM...',
			links: ['Ooombea Trading', 'Meson'],
		},
	]

	return (
		<section className='relative py-32 px-6' id='how-it-works'>
			<div className='max-w-4xl mx-auto'>
				<h2 className='text-5xl md:text-6xl font-black text-center mb-4 text-white'>
					How to Buy
				</h2>
				<p className='text-center text-slate-400 text-lg mb-20'>
					Follow those steps to purchase $HYRSTR tokens
				</p>

				<div className='space-y-8'>
					{methods.map((method, index) => (
						<div
							key={index}
							className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-400/20 hover:border-teal-400/60 transition-all'>
							<div className='flex items-start space-x-4'>
								<div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xl'>
									{index + 1}
								</div>
								<div className='flex-1'>
									<h3 className='text-xl font-bold text-white mb-3'>
										{method.title}
									</h3>
									<p className='text-slate-400 mb-4'>{method.description}</p>
									<div className='flex flex-wrap gap-3'>
										{method.links.map((link, linkIndex) => (
											<a
												key={linkIndex}
												href='#'
												className='inline-flex items-center space-x-1 px-4 py-2 bg-slate-900/50 rounded-lg text-teal-400 hover:bg-slate-900 hover:text-teal-300 transition-all text-sm font-medium group'>
												<span>{link}</span>
												<ExternalLink className='w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
											</a>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Additional info */}
				<div className='mt-12 text-center'>
					<p className='text-slate-400 text-sm'>
						or support HypurrVM (Binky), Metamask etc.
					</p>
				</div>
			</div>
		</section>
	)
}
