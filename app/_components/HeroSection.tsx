import { useEffect, useState } from 'react'
import { Sparkles, ChevronDown, ArrowRight } from 'lucide-react'
import ImageModal from './ImageModal'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

export default function Hero() {
	const [scrollY, setScrollY] = useState(0)
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isVisible, setIsVisible] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [rowCount, setRowCount] = useState(5)
	const [isMobile, setIsMobile] = useState(false)

	const backgroundImages = [
		'/background/1.avif',
		'/background/2.avif',
		'/background/3.avif',
		'/background/4.avif',
		'/background/5.avif',
		'/background/6.avif',
		'/background/7.avif',
		'/background/8.avif',
		'/background/9.avif',
		'/background/10.avif',
		'/background/11.avif',
		'/background/12.avif',
	]

	// shuffle array
	const shuffleArray = (array: string[]) => {
		const shuffled = [...array]
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
		}
		return shuffled
	}

	// generate settings for each row (direction, speed, delay, images)
	const [rows, setRows] = useState<
		{
			id: number
			images: string[]
			direction: 'left' | 'right'
			speed: number
			delay: number
		}[]
	>([])

	useEffect(() => {
		// tốc độ chung cho toàn bộ các hàng
		const commonSpeed = 100

		const newRows = Array.from({ length: rowCount }).map((_, i) => ({
			id: i,
			images: shuffleArray(backgroundImages),
			direction: i % 2 === 0 ? 'left' : 'right', // so le hướng
			speed: commonSpeed,
			delay: i * 0.2,
		})) as {
			id: number
			images: string[]
			direction: 'left' | 'right'
			speed: number
			delay: number
		}[]

		console.log(newRows)

		setRows(newRows)
		setIsVisible(true)
	}, [rowCount])

	useEffect(() => {
		const updateRowCount = () => {
			const mobile = window.innerWidth < 640 // tailwind sm breakpoint
			setIsMobile(mobile)
			setRowCount(mobile ? 4 : 5)
		}
		updateRowCount()
		window.addEventListener('resize', updateRowCount)
		return () => window.removeEventListener('resize', updateRowCount)
	}, [])

	useEffect(() => {
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
		<section className='relative h-dvh flex items-center justify-center overflow-hidden'>
			{/* Background grid */}
			<div className='absolute inset-0 overflow-hidden z-20 mt-24 mx-auto'>
				{rows.map((row, rowIndex) => (
					<div
						key={row.id}
						className='absolute flex opacity-0'
						style={{
							top: isMobile ? `${8 + rowIndex * 18}%` : `${rowIndex * 20}%`,
							height: isMobile ? '12%' : '14%',
							width: isMobile ? `${120 + rowIndex * 50}%` : `${150 + rowIndex * 50}%`,
							animation: `
								fadeInUp 1s ease-out forwards,
								scroll-${row.direction} ${row.speed}s linear infinite
							`,
							animationDelay: `${row.delay}s`,
							willChange: 'transform',
							animationTimingFunction: 'linear',
						}}>
						{/* multiple duplicated sets for seamless scroll */}
						{[...row.images, ...row.images].map((_, duplicateIndex) => (
							<div key={duplicateIndex} className='flex items-center'>
								{row.images.map((image, imageIndex) => (
									<div
										key={`${duplicateIndex}-${imageIndex}`}
										className='relative group cursor-pointer flex-shrink-0 w-[100px] h-[100px] sm:w-[100px] sm:h-[100px] md:w-[160px] md:h-[100px] lg:w-[200px] lg:h-[200px] mr-4 sm:mr-6 md:mr-10'
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											setSelectedImage(image)
										}}>
										<img
											src={image}
											alt={`Background ${imageIndex + 1}`}
											className='w-full h-full object-cover rounded-lg opacity-15 hover:opacity-70 transition-opacity duration-300 shadow-lg'
										/>
										<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
									</div>
								))}
							</div>
						))}
					</div>
				))}
			</div>

			{/* Floating orbs */}
			<div className='absolute inset-0 overflow-hidden z-0'>
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
						transform: `translate(${mousePosition.x * -20}px, ${
							mousePosition.y * -20
						}px)`,
					}}></div>
				<div
					className='absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse transition-transform duration-1000 ease-out'
					style={{
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

			{/* Main content */}
			<div className='relative z-30 max-w-7xl mx-auto px-6 text-center p-4 backdrop-blur-xs rounded-2xl'>
				<div
					className={`inline-flex items-center space-x-2 px-4 py-2 bg-teal-500/10 border border-teal-400/30 rounded-full mb-8 backdrop-blur-sm transition-all duration-1000 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
					}`}>
					<Sparkles className='w-4 h-4 text-teal-400 animate-pulse' />
					<span className='text-teal-300 text-sm font-medium'>
						Automated NFT Trading Protocol
					</span>
				</div>

				<h1 className='text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-none'>
					<span
						className={`block bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent transition-all duration-1000 delay-100 ${
							isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
						}`}
						style={{
							backgroundSize: '200% 200%',
							animation: 'gradient 8s ease infinite',
						}}>
						HYR
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
						Momentum
					</span>
				</h1>

				<p
					className={`text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
						isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
					}`}>
					An automated protocol designed for exposure to Hypurr. Active trade.
					<br />
					<span className='text-teal-400 font-semibold'>Earn while you sleep.</span>
				</p>

				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
					<Link href='/app'>
						<Button
							size='lg'
							className='bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground red-glow group animate-fade-in-up opacity-0'
							style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
							<span
								className='animate-fade-in-up opacity-0'
								style={{ animationDelay: '1.7s', animationFillMode: 'forwards' }}>
								Go to App
							</span>
							<ArrowRight
								className='h-4 w-4 group-hover:translate-x-1 transition-transform animate-fade-in-up opacity-0'
								style={{ animationDelay: '1.9s', animationFillMode: 'forwards' }}
							/>
						</Button>
					</Link>
				</div>

				<div
					className='absolute -bottom-4 sm:-bottom-24 left-0 right-0 z-30 flex justify-center animate-bounce animate-fade-in-up opacity-0'
					style={{ animationDelay: '2.2s', animationFillMode: 'forwards' }}>
					<button
						onClick={() => {
							const missionSection = document.getElementById('how-it-works')
							if (missionSection)
								missionSection.scrollIntoView({ behavior: 'smooth' })
						}}
						className='cursor-pointer hover:scale-110 transition-transform duration-200'>
						<ChevronDown className='w-8 h-8 text-teal-400' />
					</button>
				</div>
			</div>

			<ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
		</section>
	)
}
