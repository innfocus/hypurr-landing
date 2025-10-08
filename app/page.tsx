'use client'

import HeroSection from './_components/HeroSection'
import Header from './_components/Header'
import MissionSection from './_components/MissionSection'
import DeepKittySection from './_components/DeepKittySection'
import HowToBuySection from './_components/HowToBuySection'
import ImageModal from './_components/ImageModal'
import { useEffect, useState } from 'react'
import HowItWorksSection from './_components/HowItWorksSection'
import Footer from './_components/Footer'
import { NFTResult } from './api/nft/cheapest/route'

export default function HomePage() {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	const galleryImages = [
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

	const [cheapestNft, setCheapestNft] = useState<NFTResult | null>(null)

	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS

	useEffect(() => {
		const fetchData = async () => {
			const cheapestCloneXRes = await fetch(`/api/nft/cheapest?contract=${nftAddress}`)
			const cheapestCloneXJson = await cheapestCloneXRes.json()
			setCheapestNft(cheapestCloneXJson)
		}
		fetchData()
	}, [nftAddress])

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900'>
			<Header />
			<main className='pt-16'>
				<HeroSection />
				<MissionSection cheapestNft={cheapestNft} />
				<HowItWorksSection />
				<DeepKittySection />
				<HowToBuySection />
			</main>
			<Footer />
			<ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
		</div>
	)
}
