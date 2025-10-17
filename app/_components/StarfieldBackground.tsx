// components/StarfieldBackground.tsx

'use client'

import { useEffect, useRef } from 'react'

// Định nghĩa kiểu dữ liệu cho một ngôi sao
interface Star {
	x: number
	y: number
	z: number
	pz: number // Vị trí z trước đó (previous z)
}

const StarfieldBackground = (): JSX.Element => {
	// Gán kiểu HTMLCanvasElement cho ref
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		// Context có thể là null, cần kiểm tra
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// --- Cài đặt các thông số ---
		const SPEED = 0.1
		const NUM_STARS = 800
		const STAR_COLOR = '255, 255, 255'

		let stars: Star[] = [] // Mảng các ngôi sao theo kiểu Star[]
		let animationFrameId: number

		const setup = () => {
			canvas.width = window.innerWidth
			canvas.height = window.innerHeight
			stars = []
			for (let i = 0; i < NUM_STARS; i++) {
				stars.push({
					x: Math.random() * canvas.width - canvas.width / 2,
					y: Math.random() * canvas.height - canvas.height / 2,
					z: Math.random() * canvas.width,
					pz: Math.random() * canvas.width,
				})
			}
		}

		const draw = () => {
			ctx.fillStyle = 'rgba(15, 23, 43, 0.2)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)
			ctx.save()
			ctx.translate(canvas.width / 2, canvas.height / 2)

			for (let star of stars) {
				star.z -= SPEED

				if (star.z < 1) {
					star.z = canvas.width
					star.x = Math.random() * canvas.width - canvas.width / 2
					star.y = Math.random() * canvas.height - canvas.height / 2 // Sửa lỗi logic nhỏ
					star.pz = star.z
				}

				const k = 128.0 / star.z
				const px = star.x * k
				const py = star.y * k

				const size = (1 - star.z / canvas.width) * 6
				const opacity = 1 - star.z / canvas.width

				const pz_k = 128.0 / star.pz
				const p_px = star.x * pz_k
				const p_py = star.y * pz_k

				ctx.beginPath()
				ctx.moveTo(p_px, p_py)
				ctx.lineTo(px, py)
				ctx.lineWidth = size
				ctx.strokeStyle = `rgba(${STAR_COLOR}, ${opacity})`
				ctx.stroke()

				star.pz = star.z
			}
			ctx.restore()
			animationFrameId = requestAnimationFrame(draw)
		}

		setup()
		draw()

		const handleResize = () => {
			setup()
		}
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			cancelAnimationFrame(animationFrameId)
		}
	}, [])

	return <canvas ref={canvasRef} style={{ display: 'block' }} className='fixed inset-0 z-0' />
}

export default StarfieldBackground
