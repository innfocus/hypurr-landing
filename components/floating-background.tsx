'use client'

import React, { useMemo } from 'react'
import { characterImages } from './random-background'

type Props = {
	images?: readonly string[] // list ảnh trong /public hoặc CDN
	count?: number // số ảnh rải (mặc định 48)
	allowRepeat?: boolean // cho phép lặp lại ảnh (mặc định true)
	minSize?: number // px
	maxSize?: number // px
	speedRangeSec?: [number, number] // [min,max] giây cho 1 vòng rơi/trôi
	blurRangePx?: [number, number] // [min,max] px blur
	opacityRange?: [number, number] // [min,max] opacity
	rotateRangeDeg?: [number, number] // [min,max] độ xoay
	height?: string | number // '100dvh' | '100vh' | 600 ...
	className?: string
	seed?: number // để “random” có thể tái lập
	direction?: 'down' | 'up' // hướng trôi
}

type Item = {
	src: string
	leftVW: number
	size: number
	duration: number
	delay: number
	blur: number
	opacity: number
	rotate: number
}

function mulberry32(seed: number) {
	return function () {
		let t = (seed += 0x6d2b79f5)
		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export default function FloatingSpriteBackground({
	images = characterImages,
	count = 48,
	allowRepeat = true,
	minSize = 40,
	maxSize = 120,
	speedRangeSec = [28, 65],
	blurRangePx = [0, 3],
	opacityRange = [0.35, 0.75],
	rotateRangeDeg = [-8, 8],
	height,
	className = '',
	seed,
	direction = 'down',
}: Props) {
	const rnd = useMemo(() => (seed == null ? Math.random : mulberry32(seed)), [seed])

	const chosen = useMemo(() => {
		if (!images.length) return [] as string[]
		if (allowRepeat) {
			return Array.from({ length: count }, () => images[Math.floor(rnd() * images.length)])
		}
		const n = Math.min(count, images.length)
		return images.slice(0, n)
	}, [images, count, allowRepeat, rnd])

	const items: Item[] = useMemo(() => {
		const R = (a: number, b: number) => a + rnd() * (b - a)
		return chosen.map((src) => {
			const size = Math.round(R(minSize, maxSize))
			const duration = R(speedRangeSec[0], speedRangeSec[1])
			const delay = R(0, duration) // delay âm để bắt đầu giữa chừng
			const leftVW = R(0, 100)
			const blur = R(blurRangePx[0], blurRangePx[1])
			const opacity = R(opacityRange[0], opacityRange[1])
			const rotate = R(rotateRangeDeg[0], rotateRangeDeg[1])
			return { src, leftVW, size, duration, delay, blur, opacity, rotate }
		})
	}, [chosen, rnd, minSize, maxSize, speedRangeSec, blurRangePx, opacityRange, rotateRangeDeg])

	return (
		<div
			className={`absolute h-full w-full overflow-hidden ${className}`}
			style={{ height }}
			aria-hidden='true'>
			{items.map((it, i) => (
				<img
					key={i}
					src={it.src}
					alt=''
					draggable={false}
					loading='lazy'
					width={it.size}
					height={it.size}
					className='pointer-events-none select-none will-change-transform transform-gpu absolute top-[-12dvh] rbg-item rounded-lg'
					style={{
						left: `${it.leftVW}vw`,
						width: it.size,
						height: 'auto',
						opacity: it.opacity,
						rotate: `${it.rotate}deg`,
						filter: `blur(${it.blur.toFixed(1)}px)`,
						// animation
						animationName: direction === 'down' ? 'rbg-fall' : 'rbg-rise',
						animationDuration: `${it.duration}s`,
						animationTimingFunction: 'linear',
						animationIterationCount: 'infinite',
						animationDelay: `-${it.delay}s`, // bắt đầu ở vị trí ngẫu nhiên
					}}
				/>
			))}

			{/* overlay nhẹ để “ăn” vào dark mode cho đỡ chói (tuỳ chọn) */}
			<div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40' />

			<style jsx global>{`
				@keyframes rbg-fall {
					from {
						transform: translateY(0);
					}
					to {
						transform: translateY(120dvh);
					}
				}
				@keyframes rbg-rise {
					from {
						transform: translateY(110dvh);
					}
					to {
						transform: translateY(-20dvh);
					}
				}
			`}</style>
		</div>
	)
}
