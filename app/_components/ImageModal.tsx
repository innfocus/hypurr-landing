import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ImageModalProps {
	image: string | null
	onClose: () => void
}

export default function ImageModal({ image, onClose }: ImageModalProps) {
	const [isClosing, setIsClosing] = useState(false)

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handleClose()
			}
		}

		if (image) {
			document.addEventListener('keydown', handleEscape)
			document.body.style.overflow = 'hidden'
			setIsClosing(false)
		}

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = 'unset'
		}
	}, [image])

	const handleClose = () => {
		setIsClosing(true)
		// Wait for animation to complete before actually closing
		setTimeout(() => {
			onClose()
			setIsClosing(false)
		}, 200)
	}

	if (!image) return null

	return (
		<div
			className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-200 ${
				isClosing ? 'opacity-0' : 'opacity-100'
			}`}
			onClick={handleClose}>
			<button
				onClick={handleClose}
				className='absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10'>
				<X className='w-6 h-6 text-white' />
			</button>
			<div
				className={`max-w-4xl max-h-[90vh] p-4 ${
					isClosing ? 'modal-scale-out' : 'modal-scale-in'
				}`}
				onClick={(e) => e.stopPropagation()}>
				<img
					src={image}
					alt='Large view'
					className='w-full h-full object-contain rounded-2xl shadow-2xl'
				/>
			</div>
		</div>
	)
}
