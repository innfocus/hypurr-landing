import { TrendingUp, ExternalLink } from 'lucide-react'

export default function DeepKittySection() {
	const stats = [
		{ label: 'Hypurr from Bank', value: '1,525 HYPE', subtext: '$7,010.25' },
		{ label: 'Net Portfolio Value', value: '6,100 HYPE', subtext: 'from 5,100 HYPE' },
		{ label: '$HYPSTR Burned', value: '69,949,831 HYPSTR', subtext: '$420,439.99' },
		{ label: "Project's Donations", value: '8.94 ETH', subtext: '$19,341.96 donated' },
	]

	return (
		<section className='relative py-32 px-6'>
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-5xl md:text-6xl font-black text-center mb-4 text-white'>
					Deep Kitty Value
				</h2>
				<p className='text-center text-slate-400 text-lg mb-16'>Prrrrrr</p>

				{/* Mission Progress */}
				<div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-400/20 mb-12'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-xl font-bold text-white flex items-center space-x-2'>
							<span>Mission Progress</span>
							<ExternalLink className='w-4 h-4 text-slate-500' />
						</h3>
						<span className='text-teal-400 font-bold'>69.8%</span>
					</div>
					<p className='text-sm text-slate-400 mb-4'>10% before next purchase</p>
					<div className='relative h-8 bg-slate-900/50 rounded-full overflow-hidden'>
						<div
							className='absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-1000'
							style={{ width: '69.8%' }}>
							<div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'></div>
						</div>
					</div>
				</div>

				{/* Stats Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{stats.map((stat, index) => (
						<div
							key={index}
							className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/20 hover:border-teal-400/60 transition-all hover:shadow-xl hover:shadow-teal-500/20'>
							<div className='flex items-start justify-between mb-3'>
								<span className='text-sm text-slate-400'>{stat.label}</span>
								<ExternalLink className='w-4 h-4 text-slate-500' />
							</div>
							<div className='text-2xl font-black text-white mb-1'>{stat.value}</div>
							<div className='text-sm text-teal-400 flex items-center space-x-1'>
								<TrendingUp className='w-3 h-3' />
								<span>{stat.subtext}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
