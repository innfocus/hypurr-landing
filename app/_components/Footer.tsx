import { Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	const slug = process.env.NEXT_PUBLIC_NFT_SLUG

	return (
		<footer className='relative py-12 px-6 border-t border-teal-400/20'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
					{/* Logo */}
					<div className='flex items-center space-x-2'>
						<Image src='avatar.avif' alt='HYRSTR' width={32} height={32} />
						<span className='text-xl font-bold text-white'>HYRSTR</span>
					</div>

					{/* Links */}
					<div className='flex items-center space-x-12'>
						<Link
							href={`https://hyperevmscan.io/address/${tokenAddress}`}
							target='_blank'
							className='flex flex-col items-center justify-center gap-2 group'>
							<Image
								src='/hyper_liquid_icon.svg'
								alt='Hyper Liquid'
								width={24}
								height={24}
							/>
							<span className='text-slate-400 group-hover:text-teal-400 transition-colors text-sm'>
								Contract
							</span>
						</Link>
						<Link
							href={`https://opensea.io/collection/${slug}`}
							target='_blank'
							className='flex flex-col items-center justify-center gap-2 group'>
							<Image
								src='/logo/opensea.svg'
								alt='Hyper Liquid'
								width={24}
								height={24}
							/>
							<span className='text-slate-400 group-hover:text-teal-400 transition-colors text-sm'>
								Opensea
							</span>
						</Link>
						<Link
							href='https://www.geckoterminal.com/hyperevm/pools/0xd2243524b67aafcfdc6a1cabe852e8650a8602af'
							target='_blank'
							className='flex flex-col items-center justify-center gap-2 group'>
							<Image
								src='/logo/gecko-terminal.png'
								alt='Dex'
								width={24}
								height={24}
							/>
							<span className='text-slate-400 group-hover:text-teal-400 transition-colors text-sm'>
								Dex
							</span>
						</Link>
					</div>

					{/* Social */}
					<div className='flex items-center space-x-4'>
						<a
							href='#'
							className='w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all'>
							<div className='w-5 h-5' />
						</a>
					</div>
				</div>

				{/* Copyright */}
				<div className='mt-8 pt-8 border-t border-teal-400/10 text-center'>
					<p className='text-slate-500 text-sm'>
						Copyright © 2025 HYRSTR. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
