import { Twitter } from 'lucide-react'

export default function Footer() {
	return (
		<footer className='relative py-12 px-6 border-t border-teal-400/20'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
					{/* Logo */}
					<div className='flex items-center space-x-2'>
						<div className='w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg'></div>
						<span className='text-xl font-bold text-white'>HYRSTR</span>
					</div>

					{/* Links */}
					<div className='flex items-center space-x-8'>
						<a
							href='#'
							className='text-slate-400 hover:text-teal-400 transition-colors text-sm'>
							Contract
						</a>
						<a
							href='#'
							className='text-slate-400 hover:text-teal-400 transition-colors text-sm'>
							Docs
						</a>
						<a
							href='#'
							className='text-slate-400 hover:text-teal-400 transition-colors text-sm'>
							Discord
						</a>
					</div>

					{/* Social */}
					<div className='flex items-center space-x-4'>
						<a
							href='#'
							className='w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-all'>
							<Twitter className='w-5 h-5' />
						</a>
					</div>
				</div>

				{/* Copyright */}
				<div className='mt-8 pt-8 border-t border-teal-400/10 text-center'>
					<p className='text-slate-500 text-sm'>
						hypeRSTRRtl6mEXdxTQAUdQeQcGCvqZqctvZqw7dj6cz5c83G8qV
					</p>
				</div>
			</div>
		</footer>
	)
}
