import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	return (
		<footer className='py-16 border-t border-border bg-card/30 backdrop-blur-sm'>
			<div className='container mx-auto px-4'>
				<div className='flex items-center gap-8 justify-center'>
					<div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link href={'https://x.com/MurakamiSTR'} target='_blank'>
								<Image
									src='/logo/X.svg'
									alt='X'
									width={32}
									height={32}
									className='dark:invert'
								/>
							</Link>
						</div>
					</div>

					{/* <div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link href={'https://medium.com/@CloneX_REVIVAL'} target='_blank'>
								<Image
									src='/logo/Medium.svg'
									alt='Medium'
									width={32}
									height={32}
									className='dark:invert'
								/>
							</Link>
						</div>
					</div> */}

					{/* <div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link
								href={'https://discord.com/invite/clonex-revival'}
								target='_blank'>
								<Image
									src='/logo/discord.svg'
									alt='Discord'
									width={32}
									height={32}
								/>
							</Link>
						</div>
					</div> */}

					<div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link
								href={
									'https://www.geckoterminal.com/eth/pools/0x01d796689a49226872f378633028efa9272733b861a56d27685c608830acecd0'
								}
								target='_blank'>
								<Image
									src='/logo/gecko-terminal.png'
									alt='Gecko'
									width={32}
									height={32}
								/>
							</Link>
						</div>
					</div>

					<div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link
								href={
									'https://opensea.io/collection/murakami-flowers-2022-official'
								}
								target='_blank'>
								<Image
									src='/logo/opensea.svg'
									alt='OpenSea'
									width={32}
									height={32}
								/>
							</Link>
						</div>
					</div>

					<div className='text hover:text-red-300 cursor-pointer'>
						<div className='flex flex-col items-center'>
							<Link
								href={`https://etherscan.io/address/${tokenAddress}`}
								target='_blank'>
								<Image
									src='/logo/etherscan.svg'
									alt='OpenSea'
									width={32}
									height={32}
								/>
							</Link>
						</div>
					</div>
				</div>

				<div className='flex justify-center mt-8'>
					<p className='text-muted-foreground text-sm'>
						© 2025 Murakami.FlowersStrategy. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	)
}
