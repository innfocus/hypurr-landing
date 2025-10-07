import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Hero() {
	const [scrollY, setScrollY] = useState(0)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)

		const handleScroll = () => setScrollY(window.scrollY)
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({
				x: (e.clientX / window.innerWidth) * 2 - 1,
				y: (e.clientY / window.innerHeight) * 2 - 1,
			})
		}

		window.addEventListener('scroll', handleScroll)
		window.addEventListener('mousemove', handleMouseMove)

		return () => {
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [])

	return (
		<section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20'>
			{/* Animated background grid */}
			<div className='absolute inset-0 opacity-20'>
				<div className='absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/10 to-transparent'></div>
				<div
					className='absolute inset-0'
					style={{
						backgroundImage: `
              linear-gradient(to right, rgba(20, 184, 166, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(20, 184, 166, 0.1) 1px, transparent 1px)
            `,
						backgroundSize: '50px 50px',
						transform: `translateY(${scrollY * 0.5}px)`,
					}}></div>
			</div>

			{/* Floating orbs with mouse interaction */}
			<div className='absolute inset-0 overflow-hidden'>
				<div
					className='absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out'
					style={{
						transform: `translate(${mousePosition.x * 30}px, ${
							mousePosition.y * 30
						}px)`,
					}}></div>
				<div
					className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out'
					style={{
						animationDelay: '1s',
						transform: `translate(${mousePosition.x * -20}px, ${
							mousePosition.y * -20
						}px)`,
					}}></div>
				<div
					className='absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out'
					style={{
						animationDelay: '2s',
						transform: `translate(${mousePosition.x * 40}px, ${
							mousePosition.y * -25
						}px)`,
					}}></div>
			</div>

			{/* Floating particles */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className='absolute w-1 h-1 bg-teal-400/40 rounded-full'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
							animationDelay: `${Math.random() * 5}s`,
						}}></div>
				))}
			</div>

			{/* Content */}
			<div className='relative z-10 max-w-7xl mx-auto px-6 text-center'>
				{/* Badge */}
				<div
					className={`inline-flex items-center space-x-2 px-4 py-2 bg-teal-500/10 border border-teal-400/30 rounded-full mb-8 backdrop-blur-sm transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
					}`}>
					<Sparkles className='w-4 h-4 text-teal-400 animate-pulse' />
					<span className='text-teal-300 text-sm font-medium'>
						Automated NFT Trading Protocol
					</span>
				</div>

				{/* Main heading with gradient and stagger animation */}
				<h1 className='text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none'>
					<span
						className={`block bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent transition-all duration-1000 delay-100 ${
							isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
						}`}
						style={{
							backgroundSize: '200% 200%',
							animation: 'gradient 8s ease infinite',
						}}>
						Hypurr
					</span>
					<span
						className={`block bg-gradient-to-r from-cyan-200 via-teal-200 to-cyan-300 bg-clip-text text-transparent mt-2 transition-all duration-1000 delay-300 ${
							isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
						}`}
						style={{
							backgroundSize: '200% 200%',
							animation: 'gradient 8s ease infinite',
							animationDelay: '0.5s',
						}}>
						Go Burrr
					</span>
				</h1>

				{/* Subtitle */}
				<p
					className={`text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					}`}>
					An automated protocol designed for exposure to Hypurr. Active trade.
					<br />
					<span className='text-teal-400 font-semibold'>Earn while you sleep.</span>
				</p>

				{/* CTA Buttons */}
				<div
					className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-1000 delay-700 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					}`}>
					<button className='group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-teal-500/50 transition-all hover:scale-105 flex items-center space-x-2 overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
						<span className='relative z-10'>Start Trading</span>
						<ArrowRight className='relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform' />
					</button>
					<button className='group px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-teal-400/30 hover:border-teal-400 hover:bg-slate-800/80 transition-all hover:scale-105 relative overflow-hidden'>
						<div className='absolute inset-0 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
						<span className='relative z-10'>View Collection</span>
					</button>
				</div>

				{/* Stats row */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
					{[
						{ value: '1.5K+', label: 'Active Traders' },
						{ value: '6.1K', label: 'HYPE Traded' },
						{ value: '69.9M', label: 'Total Volume' },
						{ value: '8.94', label: 'ETH Floor' },
					].map((stat, index) => (
						<div
							key={index}
							className={`group p-6 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-teal-400/20 hover:border-teal-400/40 transition-all duration-700 hover:scale-105 hover:bg-slate-800/60 ${
								isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
							}`}
							style={{ transitionDelay: `${900 + index * 100}ms` }}>
							<div className='text-3xl font-black text-teal-300 mb-1 group-hover:scale-110 transition-transform duration-300'>
								{stat.value}
							</div>
							<div className='text-sm text-slate-400'>{stat.label}</div>
						</div>
					))}
				</div>

				{/* Scroll indicator */}
				<div className='flex justify-center mt-12 animate-bounce'>
					<button
						onClick={() => {
							const missionSection = document.getElementById('mission')
							if (missionSection) {
								missionSection.scrollIntoView({ behavior: 'smooth' })
							}
						}}
						className='cursor-pointer hover:scale-110 transition-transform duration-200'>
						<ChevronDown className='w-8 h-8 text-teal-400' />
					</button>
				</div>
			</div>
		</section>
	)
}
