import { useEffect, useRef, useState } from 'react'

interface RotatingGalleryProps {
	images: string[]
	onImageClick: (image: string) => void
}

export default function RotatingGallery({ images, onImageClick }: RotatingGalleryProps) {
	const [rotationX, setRotationX] = useState(0)
	const [rotationY, setRotationY] = useState(0)
	const [isDragging, setIsDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const [startY, setStartY] = useState(0)
	const [currentRotationX, setCurrentRotationX] = useState(0)
	const [currentRotationY, setCurrentRotationY] = useState(0)
	const [isMobile, setIsMobile] = useState(false)
	const animationRef = useRef<number>()
	const containerRef = useRef<HTMLDivElement>(null)

	// Handle responsive design
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)

		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true)
		setStartX(e.clientX)
		setStartY(e.clientY)
		setCurrentRotationX(rotationX)
		setCurrentRotationY(rotationY)
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isDragging) {
			const deltaX = e.clientX - startX
			const deltaY = e.clientY - startY
			setRotationY(currentRotationY + deltaX * 0.5)
			setRotationX(currentRotationX - deltaY * 0.3)
		}
	}

	const handleMouseUp = () => {
		setIsDragging(false)
	}

	const handleTouchStart = (e: React.TouchEvent) => {
		setIsDragging(true)
		setStartX(e.touches[0].clientX)
		setStartY(e.touches[0].clientY)
		setCurrentRotationX(rotationX)
		setCurrentRotationY(rotationY)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		if (isDragging) {
			const deltaX = e.touches[0].clientX - startX
			const deltaY = e.touches[0].clientY - startY
			setRotationY(currentRotationY + deltaX * 0.5)
			setRotationX(currentRotationX - deltaY * 0.3)
		}
	}

	const handleTouchEnd = () => {
		setIsDragging(false)
	}

	const createFlatGridPoints = (numPoints: number) => {
		const points = []
		// Responsive grid: smaller on mobile, larger on desktop
		const rows = isMobile ? 4 : 5
		const columns = isMobile ? 4 : 10
		const totalPoints = columns * rows
		const spacing = isMobile ? 65 : 110 // Smaller spacing on mobile

		for (let i = 0; i < totalPoints; i++) {
			const row = Math.floor(i / columns)
			const col = i % columns

			const x = (col - (columns - 1) / 2) * spacing
			const y = (row - (rows - 1) / 2) * spacing + (col % 2) * (spacing / 3)
			const z = 0

			const imageIndex = i % numPoints
			points.push({ x, y, z, index: imageIndex })
		}

		return points
	}

	const flatPoints = createFlatGridPoints(images.length)

	return (
		<div
			ref={containerRef}
			className={`relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing ${
				isMobile ? 'h-[500px]' : 'h-[800px]'
			}`}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}>
			<div
				className='relative w-full h-full'
				style={{
					transform: `perspective(1200px)`,
					transformStyle: 'preserve-3d',
				}}>
				{flatPoints.map((point, index) => {
					// Flat grid positioning
					return (
						<div
							key={index}
							className={`absolute top-1/2 left-1/2 transition-transform duration-100 `}
							style={{
								transform: `translate(-50%, -50%) translate3d(${point.x}px, ${point.y}px, ${point.z}px) `,
								transformStyle: 'preserve-3d',
								animationDelay: `${(index % (isMobile ? 6 : 10)) * 0.1}s`,
							}}>
							<button
								onClick={(e) => {
									const target = e.currentTarget
									if (target) {
										target.classList.add('image-click-scale')
										setTimeout(() => {
											if (target) {
												target.classList.remove('image-click-scale')
											}
											onImageClick(images[point.index])
										}, 150)
									}
								}}
								className='block rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300'
								style={{
									border: 'none',
									// Responsive image sizes
									width: isMobile ? '60px' : '100px',
									height: isMobile ? '60px' : '100px',
								}}>
								<img
									src={images[point.index]}
									alt={`Gallery ${point.index + 1}`}
									className='w-full h-full object-cover'
									draggable='false'
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}
