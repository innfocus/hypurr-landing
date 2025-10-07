'use client'

import { Navigation } from '@/components/navigation'
import { NftInfoModal } from '@/components/nft-info-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAppKitAccount, useAppKitBalance, useAppKitProvider } from '@reown/appkit/react'
import { useEffect, useState } from 'react'
import { Footer } from '../../components/footer'
import { SwapModal } from '../../components/swap-modal'
import TradingviewWidget from '../../components/tradingview-widget'
import { useSwapModal } from '../../context/swap-modal-context'
import { tokenUtils } from '../../contract/token/tokenInteraction'
import {
	fmtPercent,
	shortenEthAddress,
	shortenEthBalance,
	shortenEthDynamic,
} from '../../utils/utils'
import { NFTResult } from '../api/nft/cheapest/route'
import { NFTData } from '../api/nft/holding/route'
import { toast } from '../../hooks/use-toast'
import { SoldNFT } from '../api/nft/sold/route'

export default function App() {
	const [currentPrice, setCurrentPrice] = useState(0.010704)
	const [marketCap, setMarketCap] = useState(0)
	const { isOpen, closeModal } = useSwapModal()

	const [currentBalance, setCurrentBalance] = useState('0.00')

	const { walletProvider } = useAppKitProvider('eip155')

	// NFT info modal state
	const [isNftModalOpen, setIsNftModalOpen] = useState(false)
	const [isSoldNftModalOpen, setIsSoldNftModalOpen] = useState(false)
	const [selectedHolding, setSelectedHolding] = useState<NFTData | null>(null)
	const [selectedSoldNft, setSelectedSoldNft] = useState<SoldNFT | null>(null)

	const [cheapestNft, setCheapestNft] = useState<NFTResult | null>(null)

	const [currentHoldings, setCurrentHoldings] = useState<NFTData[]>([])

	const [reward, setReward] = useState('0')

	const nftAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	const ownerAddress = process.env.NEXT_PUBLIC_OWNER_ADDRESS

	const { openModal } = useSwapModal()

	const [isBuying, setIsBuying] = useState(false)
	const { isConnected, address } = useAppKitAccount()
	const { fetchBalance } = useAppKitBalance()

	const [previouslySold, setPreviouslySold] = useState<SoldNFT[]>([])

	useEffect(() => {
		const fetchPreviouslySold = async () => {
			try {
				const res = await fetch('/api/nft/sold?force=true')
				if (res.ok) {
					const data = await res.json()
					setPreviouslySold(data.sold)
				}
			} catch (error) {
				console.error('Failed to fetch previously sold NFTs', error)
			}
		}
		fetchPreviouslySold()
	}, [])

	//handle buy nft
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

	useEffect(() => {
		const fetchData = async () => {
			const balance = await tokenUtils.getBalance()
			setCurrentBalance(balance)
		}
		fetchData()

		const interval = setInterval(async () => {
			const balance = await tokenUtils.getBalance()
			setCurrentBalance(balance)
		}, 10000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			const reward = await tokenUtils.getReward()
			setReward(reward)
		}
		fetchData()
	}, [])

	useEffect(() => {
		const fetchData = async () => {
			const tokenDataRes = await fetch(
				`https://api.geckoterminal.com/api/v2/networks/eth/tokens/${tokenAddress}`
			)
			const tokenDataJson = await tokenDataRes.json()
			setCurrentPrice(parseFloat(tokenDataJson.data.attributes.price_usd))
			setMarketCap(parseFloat(tokenDataJson.data.attributes.market_cap_usd || '0'))
		}
		fetchData()

		const interval = setInterval(async () => {
			const tokenDataRes = await fetch(
				`https://api.geckoterminal.com/api/v2/networks/eth/tokens/${tokenAddress}`
			)
			const tokenDataJson = await tokenDataRes.json()
			setCurrentPrice(parseFloat(tokenDataJson.data.attributes.price_usd))
			setMarketCap(parseFloat(tokenDataJson.data.attributes.market_cap_usd || '0'))
		}, 10000)

		return () => clearInterval(interval)
	}, [tokenAddress])

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
			const nftsHoldingRes = await fetch(
				`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}`
			)
			const nftsHoldingJson = await nftsHoldingRes.json()
			setCurrentHoldings(nftsHoldingJson)
		}
		fetchData()

		const interval = setInterval(async () => {
			const nftsHoldingRes = await fetch(
				`/api/nft/holding?contract=${nftAddress}&wallet=${ownerAddress}`
			)
			const nftsHoldingJson = await nftsHoldingRes.json()
			setCurrentHoldings(nftsHoldingJson)
		}, 10000)

		return () => clearInterval(interval)
	}, [nftAddress, tokenAddress])

	const GAS_BUFFER = 0.01

	return (
		<div className='min-h-screen text-foreground'>
			{/* Navigation */}
			<Navigation />

			{/* Header */}
			<div className='border-b border-border backdrop-blur-md mt-20'>
				<div className='container mx-auto px-4 py-4'></div>
			</div>

			<div className='container mx-auto px-4 py-8 space-y-8'>
				<div className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* CloneX Strategy Holdings */}
						<Card className='bg-card-primary backdrop-blur-sm  border-primary'>
							<CardHeader className='text-center'>
								<CardTitle className='text-title-text-color text-lg md:text-2xl font-semibold '>
									Murakami.Flower Strategy™ is currently holding
								</CardTitle>
							</CardHeader>
							<CardContent className='text-center'>
								<div className=' text-4xl md:text-7xl font-bold text-primary'>
									{shortenEthDynamic(currentBalance, 4)} ETH
								</div>
							</CardContent>
						</Card>

						{/* Cheapest CloneX */}
						<Card className='bg-card-primary border-primary backdrop-blur-sm '>
							<CardHeader>
								<CardTitle className='text-title-text-color text-lg md:text-2xl font-semibold text-center'>
									Cheapest Murakami.Flower
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='flex flex-col items-center gap-3'>
									<div className='w-16 h-16 rounded-lg overflow-hidden border-2 border-red-500/50'>
										<img
											src={cheapestNft?.image || '/background/005.png'}
											alt='CloneX #6482'
											className='w-full h-full object-cover'
										/>
									</div>
									<div className='text-center'>
										<h3 className='text-sm md:text-xl font-bold text-title-text-color'>
											{cheapestNft?.name}
										</h3>
										<p className='text-sm md:text-xl text-primary font-bold mt-1'>
											{cheapestNft?.price} ETH
										</p>
										<p className='text-xs text-muted-foreground'>
											Owner:{' '}
											{cheapestNft && cheapestNft?.owner
												? shortenEthAddress(cheapestNft?.owner)
												: 'N/A'}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Progress to Next Purchase */}
					<Card className='bg-card-primary border-primary backdrop-blur-sm'>
						<CardContent className='p-3'>
							<div className='mx-4 md:mx-24 space-y-2'>
								<div className='flex justify-between items-center gap-2 flex-col md:flex-row'>
									<div className='text-sm md:text-base'>
										Progress to Next Purchase
									</div>

									<div>
										<span className='text-xs md:text-sm text-muted-foreground'>
											Current Reward:
										</span>
										<span className='text-xs md:text-sm text-primary font-bold text-md'>
											{reward} ETH
										</span>
									</div>
								</div>
								<div className='flex justify-center items-center gap-4'>
									{currentBalance !== '0.00' && cheapestNft?.price ? (
										<>
											<Progress
												value={Math.min(
													(parseFloat(currentBalance) /
														(cheapestNft?.price ?? 1)) *
														100,
													100
												)}
												className='h-4'
											/>
											<div className='text-center'>
												<span className='text-xl font-bold text-primary'>
													{fmtPercent(
														parseFloat(currentBalance) /
															(cheapestNft?.price ?? 1),
														1
													)}
												</span>
											</div>
										</>
									) : (
										// Có thể để spinner hoặc text "Loading..."
										<span className='text-gray-400 italic'>Loading...</span>
									)}
								</div>
								<div className='mt-2'>
									<div className='md:text-sm text-xs mb-1 text-title-text-color/50 text-center md:text-left'>
										When the machine acquires the missing{' '}
										<span className='text-primary'>
											{shortenEthBalance(
												Math.max(
													(cheapestNft?.price ?? 0) -
														parseFloat(currentBalance),
													0
												).toString(),
												4
											)}
										</span>
										<span className='text-primary'> ETH</span>, the first entity
										to trigger the functions below will process the mechanism
										forward and earn a reward.
									</div>
									<div className='flex gap-4 mt-6 flex-col md:flex-row'>
										<Button
											onClick={handleBuyNft}
											disabled={
												!walletProvider ||
												!cheapestNft ||
												!nftAddress ||
												isBuying ||
												parseFloat(currentBalance) < cheapestNft?.price
											}
											className='bg-primary text-foreground hover:bg-primary/80 disabled:bg-primary/50 disabled:text-white/70 disabled:cursor-not-allowed !text-[10px] md:!text-sm lg:text-base'>
											{isBuying ? 'Buying...' : 'Buy Floor Murakami.Flower'}
										</Button>
										<Button
											disabled
											className='bg-primary text-foreground hover:bg-primary/80 disabled:bg-primary/50 disabled:text-white/70 disabled:cursor-not-allowed !text-[10px] md:!text-sm lg:text-base'>
											Process Sale
										</Button>
										<Button
											disabled
											className='bg-primary text-foreground hover:bg-primary/80 disabled:bg-primary/50 disabled:text-white/70 disabled:cursor-not-allowed !text-[10px] md:!text-sm lg:text-base'>
											Buy and Burn Tokens
										</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Trading Chart Section */}
				<Card className='bg-card-primary backdrop-blur-sm border-primary'>
					<CardHeader>
						<CardTitle className=''>
							<div className='text-center'>MKFSTR/USD Trading Chart</div>

							<div className='flex items-center gap-4 text-sm justify-between mt-4'>
								<div className='text-center flex flex-col md:flex-row'>
									<span className='text-muted-foreground mr-1'>Market Cap</span>
									<span className='font-bold text-primary text-xs md:text-sm lg:text-base'>
										${marketCap.toLocaleString()}
									</span>
								</div>
								<div className='text-center flex flex-col md:flex-row'>
									<span className='text-muted-foreground mr-1'>$ Price</span>
									<span className='font-bold text-primary text-xs md:text-sm lg:text-base'>
										${currentPrice.toFixed(6)}
									</span>
								</div>
							</div>
							{/* <div className='flex items-center gap-2'>
									{priceChange >= 0 ? (
										<TrendingUp className='h-4 w-4 text-green-500' />
									) : (
										<TrendingDown className='h-4 w-4 text-red-500' />
									)}
									<span
										className={
											priceChange >= 0 ? 'text-green-500' : 'text-red-500'
										}>
										{priceChange >= 0 ? '+' : ''}
										{(priceChange * 100).toFixed(2)}%
									</span>
								</div> */}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='relative rounded-lg border border-border/50 overflow-hidden bg-background'>
							<TradingviewWidget />
						</div>
						<div className='mt-6'>
							<Button
								className='bg-primary text-white dark:text-background font-bold max-w-xs mx-auto block shadow-lg'
								onClick={() => openModal()}>
								Buy $MKFSTR
							</Button>
						</div>
					</CardContent>
				</Card>

				<div className=''>
					{/* Currently Holding */}

					<Card className='bg-card/50 backdrop-blur-sm border-primary'>
						<CardHeader>
							<CardTitle className='text-foreground text-2xl font-bold text-center cursor-pointer'>
								Currently Holding
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-2 md:grid-cols-8 gap-4'>
								{currentHoldings &&
									currentHoldings.length > 0 &&
									currentHoldings.map((holding, index) => (
										<div
											key={`${holding.tokenId}-${index}`}
											className='group relative cursor-pointer'
											onClick={() => {
												setSelectedHolding(holding)
												setIsNftModalOpen(true)
											}}>
											<div className='relative overflow-hidden rounded-lg border border-border/50 group-hover:border-primary/50 transition-all duration-300'>
												<div className='aspect-square'>
													<img
														src={holding.image || '/placeholder.svg'}
														alt={`CloneX ${holding.tokenId}`}
														className='w-full h-full object-cover'
													/>
												</div>
											</div>
											<div className='mt-2 text-center'>
												<p className='font-medium text-sm'>
													{holding.name}
												</p>
												<p className='text-pink-500 font-bold text-sm'>
													{holding.lastSalePrice} ETH
												</p>
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>

					{/* Previously Sold */}
					<Card className='bg-card/50 border-border backdrop-blur-sm mt-4'>
						<CardHeader>
							<CardTitle className='text-foreground text-2xl font-bold text-center'>
								Previously Sold Murakami.Flowers
							</CardTitle>
						</CardHeader>
						<CardContent>
							{previouslySold && previouslySold.length > 0 ? (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
									{previouslySold.map((sale, idx) => {
										const boughtPrice = parseFloat(sale.boughtPrice || '0')
										const soldPrice = parseFloat(sale.soldPrice || '0')
										const profit = soldPrice - boughtPrice
										const profitPercentage =
											boughtPrice > 0 ? (profit / boughtPrice) * 100 : 0

										return (
											<div
												key={sale.tokenId + '-' + idx}
												className='bg-card-primary/50 border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300'
												onClick={() => {
													setSelectedSoldNft(sale)
													setIsSoldNftModalOpen(true)
												}}>
												{/* NFT Image */}
												<div className='flex justify-center mb-3'>
													<div className='w-20 h-20 rounded-lg overflow-hidden border-2 border-border'>
														<img
															src={sale.image || '/placeholder.svg'}
															alt={sale.name}
															className='w-full h-full object-cover'
														/>
													</div>
												</div>

												{/* NFT Name */}
												<div className='text-center mb-4'>
													<div className='bg-muted/50 rounded-md px-2 py-1 inline-block'>
														<span className='text-sm font-medium text-foreground'>
															{sale.name}
														</span>
													</div>
												</div>

												{/* Financial Details */}
												<div className='space-y-2'>
													<div className='flex justify-between items-center'>
														<span className='text-sm text-muted-foreground'>
															Bought for:
														</span>
														<span className='text-sm font-medium text-foreground'>
															{shortenEthBalance(
																sale.boughtPrice ?? '0'
															) || 'N/A'}{' '}
															ETH
														</span>
													</div>
													<div className='flex justify-between items-center'>
														<span className='text-sm text-muted-foreground'>
															Sold for:
														</span>
														<span className='text-sm font-medium text-foreground'>
															{shortenEthBalance(
																sale.soldPrice ?? '0'
															) || 'N/A'}{' '}
															ETH
														</span>
													</div>
													<div className='flex justify-between items-center border-t border-border pt-2'>
														<span className='text-sm font-medium text-foreground'>
															Profit:
														</span>
														<span
															className={`text-sm font-bold ${
																profit >= 0
																	? 'text-green-500'
																	: 'text-red-500'
															}`}>
															{profit >= 0 ? '+' : ''}
															{profit.toFixed(4)} ETH
														</span>
													</div>
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<div className='text-muted-foreground text-center py-8'>
									No previously sold Murakami.Flower NFTs.
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				<Footer />
			</div>

			{/* Global Swap Modal */}
			<SwapModal isOpen={isOpen} onClose={closeModal} />

			{/* NFT Info Modal */}
			<NftInfoModal
				open={isNftModalOpen}
				onOpenChange={setIsNftModalOpen}
				nft={selectedHolding}
			/>

			<NftInfoModal
				open={isSoldNftModalOpen}
				onOpenChange={setIsSoldNftModalOpen}
				nft={selectedSoldNft as SoldNFT}
			/>
		</div>
	)
}
