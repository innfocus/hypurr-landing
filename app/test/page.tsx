'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function ParticleCanvas() {
	const canvasRef = useRef(null as HTMLCanvasElement | null)
	const mouse = useRef({ x: 0, y: 0 })
	const particles = useRef<{ x: number; y: number; vx: number; vy: number; r: number }[]>([])
	const raf = useRef<number | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current!
		const ctx = canvas.getContext('2d')!

		const resize = () => {
			canvas.width = window.innerWidth
			canvas.height = Math.max(window.innerHeight, 700)
		}
		resize()
		window.addEventListener('resize', resize)

		const N = Math.min(140, Math.floor((canvas.width * canvas.height) / 20000))
		particles.current = Array.from({ length: N }).map(() => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			vx: (Math.random() - 0.5) * 0.4,
			vy: (Math.random() - 0.5) * 0.4,
			r: Math.random() * 1.8 + 0.6,
		}))

		const tick = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			// subtle gradient bg glow overlay
			const grad = ctx.createRadialGradient(
				mouse.current.x,
				mouse.current.y,
				20,
				mouse.current.x,
				mouse.current.y,
				400
			)
			grad.addColorStop(0, 'rgba(26, 255, 255, 0.18)')
			grad.addColorStop(1, 'rgba(0,0,0,0)')
			ctx.fillStyle = grad
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			const ps = particles.current
			for (let i = 0; i < ps.length; i++) {
				const p = ps[i]
				// gentle attraction to mouse
				const dx = mouse.current.x - p.x
				const dy = mouse.current.y - p.y
				const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
				const force = Math.min(0.06 / dist, 0.02)
				p.vx += force * dx
				p.vy += force * dy
				// damping
				p.vx *= 0.985
				p.vy *= 0.985
				p.x += p.vx
				p.y += p.vy
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1

				// draw particle
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
				ctx.fillStyle = 'rgba(180, 255, 255, 0.8)'
				ctx.fill()
			}

			// draw connecting lines
			for (let i = 0; i < ps.length; i++) {
				for (let j = i + 1; j < ps.length; j++) {
					const a = ps[i],
						b = ps[j]
					const dx = a.x - b.x
					const dy = a.y - b.y
					const d2 = dx * dx + dy * dy
					if (d2 < 130 * 130) {
						const alpha = 1 - d2 / (130 * 130)
						ctx.strokeStyle = `rgba(96, 224, 255, ${alpha * 0.24})`
						ctx.lineWidth = 1
						ctx.beginPath()
						ctx.moveTo(a.x, a.y)
						ctx.lineTo(b.x, b.y)
						ctx.stroke()
					}
				}
			}

			raf.current = requestAnimationFrame(tick)
		}
		raf.current = requestAnimationFrame(tick)

		const move = (e: MouseEvent) => {
			mouse.current.x = e.clientX
			mouse.current.y = e.clientY
		}
		window.addEventListener('mousemove', move)

		return () => {
			window.removeEventListener('resize', resize)
			window.removeEventListener('mousemove', move)
			if (raf.current) cancelAnimationFrame(raf.current)
		}
	}, [])

	return <canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />
}

export default function HyprstrWireframe() {
	const [dark, setDark] = useState(true)
	const { scrollYProgress } = useScroll()
	const ySlow = useTransform(scrollYProgress, [0, 1], [0, 200])
	const yFast = useTransform(scrollYProgress, [0, 1], [0, 450])
	return (
		<div className={(dark ? 'dark ' : '') + 'min-h-screen'}>
			<div className='relative min-h-screen bg-gradient-to-b from-white to-[#f3f7ff] text-black dark:from-[#0a0a0f] dark:to-[#111] dark:text-white transition-colors'>
				{/* THEME TOGGLE */}
				<div className='fixed right-4 top-4 z-50 flex items-center gap-3'>
					<span className='text-xs text-gray-600 dark:text-gray-300'>
						{dark ? 'Dark' : 'Light'} mode
					</span>
					<Button
						variant='secondary'
						className='rounded-full'
						onClick={() => setDark((v) => !v)}>
						Toggle
					</Button>
				</div>

				{/* PARALLAX LAYERS */}
				<motion.div
					style={{ y: ySlow }}
					className='pointer-events-none absolute -top-20 left-[-10%] h-[40rem] w-[40rem] rounded-full blur-3xl opacity-50 bg-gradient-to-tr from-cyan-400 to-purple-500 dark:opacity-40'
				/>
				<motion.div
					style={{ y: yFast }}
					className='pointer-events-none absolute top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full blur-3xl opacity-40 bg-gradient-to-tr from-fuchsia-400 to-sky-500 dark:opacity-30'
				/>

				{/* HERO SECTION */}
				<section className='relative flex flex-col items-center justify-center h-screen text-center overflow-hidden'>
					<ParticleCanvas />
					<motion.h1
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
						className='relative z-10 text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600'>
						HYPRSTR
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 1 }}
						className='relative z-10 max-w-2xl text-gray-700 dark:text-gray-300 mb-8'>
						The next evolution of decentralized performance and hyperreal strategy.
					</motion.p>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6 }}
						className='relative z-10'>
						<Button
							size='lg'
							className='bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full px-10 py-6'>
							Explore Now
						</Button>
					</motion.div>
					<div className='absolute bottom-10 animate-bounce text-gray-500 dark:text-gray-400 text-sm z-10'>
						Scroll ↓
					</div>
				</section>

				{/* HOW IT WORKS */}
				<section className='py-32 bg-gradient-to-b from-transparent to-white/60 dark:to-[#0d0d14]'>
					<div className='max-w-6xl mx-auto text-center'>
						<h2 className='text-4xl font-semibold mb-12'>How It Works</h2>
						<div className='grid md:grid-cols-3 gap-8'>
							{['Connect', 'Trade', 'Earn'].map((step, i) => (
								<Card
									key={i}
									className='bg-white/70 dark:bg-[#151521] border border-gray-200 dark:border-gray-700 hover:border-cyan-400 transition shadow-lg dark:shadow-none'>
									<CardContent className='p-10'>
										<h3 className='text-2xl font-bold mb-4 text-cyan-600 dark:text-cyan-400'>
											{step}
										</h3>
										<p className='text-gray-600 dark:text-gray-400 text-sm'>
											Lorem ipsum dolor sit amet consectetur adipisicing elit.
											Distinctio, reprehenderit.
										</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>
				{/* MISSION / STATS */}
				<section className='py-24 text-center bg-gradient-to-r from-white to-slate-50 dark:from-[#0b0b12] dark:to-[#131325]'>
					<h2 className='text-4xl font-semibold mb-10'>Our Mission</h2>
					<div className='flex flex-wrap justify-center gap-12'>
						{[
							{ label: 'Users', value: '120K+' },
							{ label: 'Transactions', value: '4.5M+' },
							{ label: 'Partners', value: '60+' },
						].map((item, i) => (
							<div key={i} className='text-center'>
								<p className='text-5xl font-extrabold text-cyan-600 dark:text-cyan-400'>
									{item.value}
								</p>
								<p className='text-gray-600 dark:text-gray-400 text-sm mt-2'>
									{item.label}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* ROADMAP */}
				<section className='py-32 bg-gradient-to-b from-slate-50 to-white dark:from-[#0e0e16] dark:to-[#0a0a0f] text-center'>
					<h2 className='text-4xl font-semibold mb-16'>Roadmap</h2>
					<div className='max-w-4xl mx-auto border-l border-gray-200 dark:border-gray-700 pl-8 space-y-12'>
						{[
							{ q: 'Q1 2025', text: 'Launch of Beta Platform' },
							{ q: 'Q2 2025', text: 'NFT Integration & Token Launch' },
							{ q: 'Q3 2025', text: 'DEX Listing & Partner Expansion' },
						].map((item, i) => (
							<motion.div
								key={i}
								whileInView={{ opacity: 1, x: 0 }}
								initial={{ opacity: 0, x: -40 }}
								transition={{ duration: 0.6 }}
								className='relative'>
								<div className='absolute -left-4 top-2 w-3 h-3 bg-cyan-600 dark:bg-cyan-400 rounded-full'></div>
								<h4 className='text-cyan-700 dark:text-cyan-400 font-bold'>
									{item.q}
								</h4>
								<p className='text-gray-700 dark:text-gray-300'>{item.text}</p>
							</motion.div>
						))}
					</div>
				</section>

				{/* FOOTER */}
				<footer className='py-12 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 text-sm'>
					© 2025 HYPRSTR. All rights reserved.
				</footer>
			</div>
		</div>
	)
}
