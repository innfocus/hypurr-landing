import { TrendingUp, ExternalLink } from 'lucide-react'
import { NFTResult } from '../api/nft/cheapest/route'
import { fmtPercent, shortenEthBalance } from '../../utils/utils'
import { Button } from '../../components/ui/button'
import { useEffect, useState } from 'react'
import { tokenUtils } from '../../contract/token/tokenInteraction'
import { useAppKitAccount, useAppKitBalance, useAppKitProvider } from '@reown/appkit/react'
import { toast } from '../../hooks/use-toast'

export default function DeepKittySection() {
	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS

	const [currentBalance, setCurrentBalance] = useState(0)
	const [cheapestNft, setCheapestNft] = useState<NFTResult | null>(null)

	const target = cheapestNft?.price || 0
	const progress = Math.min((currentBalance / target) * 100, 100)

	const [isBuying, setIsBuying] = useState(false)
	const { isConnected, address } = useAppKitAccount()
	const { fetchBalance } = useAppKitBalance()

	const { walletProvider } = useAppKitProvider('eip155')

	useEffect(() => {
		const fetchData = async () => {
			const cheapestCloneXRes = await fetch(`/api/nft/cheapest?contract=${nftAddress}`)
			const cheapestCloneXJson = await cheapestCloneXRes.json()
			setCheapestNft(cheapestCloneXJson)
		}
		fetchData()
	}, [nftAddress])

	useEffect(() => {
		const fetchData = async () => {
			const balance = await tokenUtils.getBalance()
			setCurrentBalance(parseFloat(balance))
		}
		fetchData()

		const interval = setInterval(async () => {
			const balance = await tokenUtils.getBalance()
			setCurrentBalance(parseFloat(balance))
		}, 10000)

		return () => clearInterval(interval)
	}, [])

	const handleBuyNft = async () => {
		if (!isConnected || !address) {
			toast({
				title: 'Please connect your wallet',
				variant: 'destructive',
			})
			return
		}

		const balance = await fetchBalance()

		if (parseFloat(balance?.data?.balance || '0') <= 0) {
			toast({
				title: 'Please deposit ETH to your wallet',
				variant: 'destructive',
			})
			return
		}

		if (walletProvider && cheapestNft && nftAddress) {
			try {
				setIsBuying(true)
				const tx = await tokenUtils.buyNftWithEth(
					walletProvider,
					nftAddress!,
					cheapestNft.tokenId!
				)
				toast({
					title: 'Buy successful',
					description: 'Transaction id: ' + tx.hash,
					variant: 'default',
				})
			} catch (error) {
				toast({
					title: 'Buy failed',
					description: 'Error: ' + error,
					variant: 'destructive',
				})
				console.error(error)
			} finally {
				setIsBuying(false)
			}
		}
	}

	return (
		<section className='relative pt-32 px-6 mb-32'>
			<div className='max-w-6xl mx-auto'>
				<h2 className='text-5xl md:text-6xl font-black text-center mb-4 text-white'>
					Deep Kitty Value
				</h2>
				<p className='text-center text-slate-400 text-lg mb-16'>Prrrrrr</p>

				{/* Cheapest NFT */}
				<div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-400/20 mb-12 mt-12'>
					<div className='flex flex-col items-center justify-center mb-8'>
						<h1 className='text-2xl font-bold text-center  text-white mb-2'>
							Current Holding
						</h1>
						<p className='text-center text-primary text-5xl mb-4 font-bold'>
							{currentBalance} HYPE
						</p>
					</div>

					<div className='flex items-center justify-center mx-auto'>
						<div className='relative aspect-square w-full md:w-[500px] md:h-[500px] p-16 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full flex items-center justify-center'>
							{/* Ring Chart */}
							<svg
								className='absolute inset-0 w-full h-full rotate-[-90deg]'
								viewBox='0 0 100 100'>
								{/* Background ring */}
								<circle
									cx='50'
									cy='50'
									r='45'
									stroke='rgba(45, 212, 191, 0.2)' /* teal-400/20 */
									strokeWidth='6'
									fill='none'
								/>
								{/* Progress ring */}
								<circle
									cx='50'
									cy='50'
									r='45'
									stroke='url(#grad)'
									strokeWidth='6'
									fill='none'
									strokeDasharray='282.6' /* 2πr = 2*π*45 */
									strokeDashoffset={`${
										282.6 - (progress / 100) * 282.6
									}`} /* tính theo % */
									strokeLinecap='round'
									className='transition-all duration-700 ease-in-out'
								/>
								<defs>
									<linearGradient id='grad' x1='0' y1='0' x2='1' y2='1'>
										<stop offset='0%' stopColor='#14b8a6' />
										<stop offset='100%' stopColor='#06b6d4' />
									</linearGradient>
								</defs>
							</svg>

							{/* Progress percentage display at outer edge */}
							<div className='absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-10'>
								<div className='bg-teal-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-teal-400/30 shadow-lg'>
									<span className='text-white font-bold text-lg'>
										{progress.toFixed(1)}%
									</span>
								</div>
							</div>

							<div className='relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/20 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/20 transition-all duration-700 ease-out w-[65%]'>
								<div className='aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden '>
									{cheapestNft && (
										<div
											className='absolute inset-0 bg-cover bg-center blur-sm'
											style={{
												backgroundImage: `url(${cheapestNft.image})`,
											}}></div>
									)}
									<div className='absolute inset-0 bg-gradient-to-br from-slate-700/80 to-slate-800/80'></div>
									<div className='relative z-10 w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-2xl font-bold'>
										?
									</div>
								</div>
								<div className='text-center'>
									<span className='text-slate-400 text-sm'>
										{cheapestNft?.name}
									</span>
									<p className='text-xs text-slate-500 mt-1'>
										{shortenEthBalance(
											(
												(cheapestNft?.price || 0) - currentBalance
											).toString() || '0'
										)}{' '}
										HYPE until next purchase
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className='flex justify-center items-center gap-4 mt-6 flex-col md:flex-row'>
						<Button
							onClick={handleBuyNft}
							disabled={
								!walletProvider ||
								!cheapestNft ||
								!nftAddress ||
								isBuying ||
								currentBalance < cheapestNft?.price
							}
							className='bg-primary text-foreground hover:bg-primary/80 disabled:bg-primary/50 disabled:text-white/70 disabled:cursor-not-allowed !text-[10px] md:!text-sm lg:text-base'>
							{isBuying ? 'Buying...' : 'Buy Floor Hypur'}
						</Button>
					</div>
				</div>

				{/* Mission Progress */}
				{/* <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-400/20 mb-12 mt-24'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-xl font-bold text-white flex items-center space-x-2'>
							<span>Mission Progress</span>
							<ExternalLink className='w-4 h-4 text-slate-500' />
						</h3>
						<span className='text-teal-400 font-bold'>
							{fmtPercent(
								parseFloat(currentBalance.toString()) / (cheapestNft?.price ?? 1),
								1
							)}
						</span>
					</div>
					<p className='text-sm text-slate-400 mb-4'>10% before next purchase</p>
					<div className='relative h-8 bg-slate-900/50 rounded-full overflow-hidden'>
						<div
							className='absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-1000'
							style={{ width: '69.8%' }}>
							<div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'></div>
						</div>
					</div>
				</div> */}
			</div>
		</section>
	)
}
