'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

export const characterImages = [
	'background/001.png',
	'background/002.png',
	'background/003.png',
	'background/004.png',
	'background/005.png',
	'background/006.png',
	'background/007.png',
	'background/008.png',
	'background/009.png',
	'background/010.png',
	'background/011.png',
	'background/012.png',
	'background/013.png',
	'background/014.png',
	'background/015.png',
	'background/016.png',
	'background/017.png',
	'background/018.png',
	'background/019.png',
	'background/020.png',
	'background/021.png',
]

type RandomBackgroundProps = {
	/** Danh sách ảnh (đường dẫn trong /public hoặc import tĩnh) */
	images?: readonly string[]
	/** Số ảnh muốn rải (có thể > images.length vì allowRepeat) */
	count?: number
	/** Cho phép lặp lại ảnh (mặc định true) */
	allowRepeat?: boolean
	/** Cố gắng tránh đè (tốn CPU khi count lớn) */
	avoidOverlap?: boolean
	/** Kích thước px tối thiểu/tối đa mỗi item */
	minSize?: number
	maxSize?: number
	/** Chiều cao container (px hoặc '50vh'...) */
	height?: number | string
	/** Z-index & className để phối layout */
	zIndex?: number
	className?: string
	/** Seed để random có thể tái lập (option) */
	seed?: number
	/** Click để random lại (mặc định true) */
	refreshOnClick?: boolean
}

type Item = {
	src: string
	x: number
	y: number
	w: number
	h: number
	rot: number
	delay: number
}

// PRNG có seed (mulberry32)
function mulberry32(seed: number) {
	return function () {
		let t = (seed += 0x6d2b79f5)
		t = Math.imul(t ^ (t >>> 15), t | 1)
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

export default function RandomBackground({
	images = characterImages,
	count,
	allowRepeat = true,
	avoidOverlap = true,
	minSize = 56,
	maxSize = 140,
	height,
	zIndex = 0,
	className = '',
	seed,
	refreshOnClick = true,
}: RandomBackgroundProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [items, setItems] = useState<Item[]>([])

	const next = useMemo(() => (seed == null ? Math.random : mulberry32(seed)), [seed])

	const rectsOverlap = (a: DOMRect, b: DOMRect) =>
		!(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)

	const place = () => {
		const el = containerRef.current
		if (!el || !images.length) return
		const { width, height } = el.getBoundingClientRect()
		if (!width || !height) return

		const N = count ?? images.length
		const chosen = allowRepeat
			? Array.from({ length: N }, () => images[Math.floor(next() * images.length)])
			: images.slice(0, Math.min(N, images.length))

		const out: Item[] = []
		const rects: DOMRect[] = []
		const maxTries = Math.max(3000, N * 200)
		let tries = 0

		for (let i = 0; i < chosen.length && tries < maxTries; i++) {
			const src = chosen[i]
			let ok = false

			for (let k = 0; k < 150 && tries < maxTries; k++) {
				tries++
				const size = Math.floor(minSize + next() * (maxSize - minSize))
				const aspect = 0.85 + next() * 0.3 // gần vuông
				const w = size
				const h = Math.round(size * aspect)
				const x = Math.floor(next() * Math.max(1, width - w))
				const y = Math.floor(next() * Math.max(1, height - h))
				const rot = Math.round((next() * 10 - 5) * 10) / 10 // -5..5°
				const delay = Math.round(next() * 600) / 100 // 0–6s

				const r = new DOMRect(x, y, w, h)
				if (avoidOverlap && rects.some((rr) => rectsOverlap(rr, r))) continue

				rects.push(r)
				out.push({ src, x, y, w, h, rot, delay })
				ok = true
				break
			}

			// fallback: cho chồng nếu quá khó đặt
			if (!ok) {
				const size = Math.floor(minSize + next() * (maxSize - minSize))
				const w = size,
					h = size
				out.push({
					src,
					x: Math.floor(next() * Math.max(1, width - w)),
					y: Math.floor(next() * Math.max(1, height - h)),
					w,
					h,
					rot: Math.round((next() * 10 - 5) * 10) / 10,
					delay: Math.round(next() * 600) / 100,
				})
			}
		}

		setItems(out)
	}
	// Đặt lần đầu + khi resize
	useLayoutEffect(() => {
		place()
		const ro = new ResizeObserver(() => place())
		if (containerRef.current) ro.observe(containerRef.current)
		return () => ro.disconnect()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images.join('|'), count, allowRepeat, avoidOverlap, minSize, maxSize, seed])

	const onClick = () => {
		if (refreshOnClick) place()
	}

	return (
		<div
			ref={containerRef}
			onClick={onClick}
			className={`absolute h-full w-full overflow-hidden ${className}`}
			style={{ ...(height !== undefined ? { height } : {}), zIndex }}
			aria-hidden='true'>
			{items.map((it, idx) => (
				<img
					key={idx}
					src={it.src}
					alt=''
					aria-hidden='true'
					loading='lazy'
					draggable={false}
					width={it.w}
					height={it.h}
					className='random-blob select-none transform-gpu will-change-transform rounded-xl blur-[2px] opacity-20'
					style={{
						left: it.x,
						top: it.y,
						width: it.w,
						height: it.h,
						rotate: it.rot + 'deg', // không dùng transform để tránh xung đột với animation
						animationDelay: it.delay + 's',
					}}
				/>
			))}

			{/* CSS tự chứa cho hiệu ứng */}
			<style jsx global>{`
				@keyframes rbg-float {
					0%,
					100% {
						translate: 0 0;
					}
					50% {
						translate: 0 -8px;
					}
				}
				@supports not (translate: 0) {
					@keyframes rbg-float {
						0%,
						100% {
							transform: translateY(0) var(--rbg-rot, rotate(0deg));
						}
						50% {
							transform: translateY(-8px) var(--rbg-rot, rotate(0deg));
						}
					}
				}
				.rbg-item {
					position: absolute;
					pointer-events: none;
					animation: rbg-float 9s ease-in-out infinite;
					opacity: 0.9;
				}
			`}</style>
		</div>
	)
}
