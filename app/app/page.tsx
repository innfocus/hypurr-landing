'use client'

import { useEffect, useState } from 'react'
import { NFTResult } from '../api/nft/cheapest/route'
import { useSwapModal } from '../../context/swap-modal-context'
import Header from '../_components/Header'
import MissionSection from '../_components/MissionSection'
import ImageModal from '../_components/ImageModal'
import { SwapModal } from '../../components/SwapModal'
import DeepKittySection from '../_components/DeepKittySection'
import Footer from '../_components/Footer'
import { tokenUtils } from '../../contract/token/tokenInteraction'
import TradingChartSection from '../_components/TradingChartSection'
import FloatingSpriteBackground from '../../components/floating-background'
import StarfieldBackground from '../_components/StarfieldBackground'

export default function AppPage() {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	const { isOpen, closeModal } = useSwapModal()

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900'>
			<Header />
			<main>
				<div className='starfield-background'>
					<StarfieldBackground />
				</div>
				<DeepKittySection />
				<MissionSection />
				<TradingChartSection />
			</main>
			<Footer />
			<ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />

			<SwapModal isOpen={isOpen} onClose={closeModal} />
		</div>
	)
}
