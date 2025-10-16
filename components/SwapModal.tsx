'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, ArrowUpDown, Copy } from 'lucide-react'
import {
	useAppKitAccount,
	useAppKitBalance,
	useAppKitProvider,
	useAppKitState,
} from '@reown/appkit/react'
import { shortenEthBalance, shortenTokenBalance } from '../utils/utils'
import { tokenUtils } from '../contract/token/tokenInteraction'
import { QuoterContract } from '../contract/quoter/quoter_interaction'
import Image from 'next/image'

import { toast } from '@/hooks/use-toast'
import { BrowserProvider, Eip1193Provider } from 'ethers'
import { swapETHForToken, swapTokenForETH } from '../contract/hyperswap_swap_functions'

interface SwapModalProps {
	isOpen: boolean
	onClose: () => void
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
	const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy')
	const [fromAmount, setFromAmount] = useState('')
	const [toAmount, setToAmount] = useState('')
	const [balance, setBalance] = useState<string | undefined>()
	const [tokenBalance, setTokenBalance] = useState<string | undefined>()
	const [isLoading, setIsLoading] = useState(false)
	const [validationError, setValidationError] = useState<string | null>(null)

	const { isConnected, address } = useAppKitAccount()
	const { fetchBalance } = useAppKitBalance()

	const { walletProvider } = useAppKitProvider('eip155')

	const quoteContract = new QuoterContract()

	const { selectedNetworkId } = useAppKitState()

	useEffect(() => {
		if (isConnected) {
			fetchBalance().then(({ data }) => setBalance(data?.balance))
			fetchBalanceToken()
		}
	}, [isConnected, address])

	useEffect(() => {
		if (selectedNetworkId) {
			fetchBalance().then(({ data }) => setBalance(data?.balance))
		}
	}, [selectedNetworkId])

	useEffect(() => {
		if (fromAmount.trim() == '') {
			setToAmount('')
			return
		}

		try {
			const amountNumber = parseFloat(fromAmount)
			if (amountNumber <= 0) {
				setToAmount('')
				return
			} else {
				if (activeTab === 'buy') {
					getQuoteFromEthToToken({ amount: fromAmount })
				} else {
					getQuoteFromTokenToEth({ amount: fromAmount })
				}
			}
		} catch (error) {}
	}, [isConnected, fromAmount])

	const getQuoteFromEthToToken = async ({ amount }: { amount: string }) => {
		try {
			const quote = await quoteContract.getExactAmountIn({
				amountIn: amount,
				zeroForOne: true,
			})

			setToAmount(quote)

			// const result = await fetch(
			// 	`https://liqd.ag/api/swap/quote?inputToken=${ETH_TOKEN.address}&outputToken=${TOKEN_INFO.address}&amount=${amount}&slippage=1&multiHop=true`
			// )
			// const data = await result.json()
			// setToAmount(data.amountOut)
		} catch (error) {
			console.error('Error getting quote:', error)
			setToAmount('0')
		}
	}

	const getQuoteFromTokenToEth = async ({ amount }: { amount: string }) => {
		try {
			const quote = await quoteContract.getExactAmountIn({
				amountIn: amount,
				zeroForOne: false,
			})

			setToAmount(quote)
		} catch (error) {
			console.error('Error getting quote:', error)
			setToAmount('0')
		}
	}

	const fetchBalanceToken = async () => {
		if (walletProvider && isConnected) {
			try {
				const balance = await tokenUtils.getTokenBalance(address || '')
				setTokenBalance(balance)
			} catch (error) {
				console.error('Error fetching token balance:', error)
				setTokenBalance('0')
			}
		}
	}

	const handleMaxClick = () => {
		if (activeTab === 'buy' && balance) {
			setFromAmount(balance)
			setValidationError(null) // Clear any validation errors when using max
		} else if (activeTab === 'sell' && tokenBalance) {
			setFromAmount(tokenBalance)
			setValidationError(null) // Clear any validation errors when using max
		}
	}

	const handleTabChange = (tab: 'buy' | 'sell') => {
		setActiveTab(tab)
		setFromAmount('')
		setToAmount('')
		setValidationError(null)
	}

	const handleClose = () => {
		setFromAmount('')
		setToAmount('')
		setValidationError(null)
		onClose()
	}

	const validateAmount = (amount: string): string | null => {
		if (!amount || amount.trim() === '') return null

		const amountNumber = parseFloat(amount)
		if (isNaN(amountNumber) || amountNumber <= 0) return null

		if (activeTab === 'buy') {
			// For buy: check if ETH amount exceeds ETH balance
			const ethBalance = parseFloat(balance || '0')
			if (amountNumber > ethBalance) {
				return `Insufficient HYPE balance`
			}
		} else {
			// For sell: check if MKFSTR amount exceeds MKFSTR balance
			const tokenBalanceNum = parseFloat(tokenBalance || '0')
			if (amountNumber > tokenBalanceNum) {
				return `Insufficient MKFSTR balance`
			}
		}

		return null
	}

	const handleFromAmountChange = async (value: string) => {
		setFromAmount(value)

		// Validate the amount
		const error = validateAmount(value)
		setValidationError(error)

		if (value && walletProvider && !error) {
		} else {
			setToAmount('')
		}
	}

	const handleSwap = async () => {
		if (!fromAmount || !toAmount || !walletProvider || validationError) return

		setIsLoading(true)
		try {
			if (activeTab === 'buy') {
				// Handle buy logic: ETH to Token via Router
				const provider = new BrowserProvider(walletProvider as Eip1193Provider)
				const signer = await provider.getSigner()

				const tx = await swapETHForToken(provider, signer, toAmount, address, fromAmount)
				console.log('Swap ETH → TOKEN completed!')

				// Optional: await tx.wait()
				toast({
					title: 'Swap successful',
					description: 'Transaction id: ' + tx!.hash,
					variant: 'default',
				})

				await fetchBalance()
				await fetchBalanceToken()

				// reset form
				setFromAmount('')
				setToAmount('')

				// close modal
				onClose()
			} else {
				const provider = new BrowserProvider(walletProvider as Eip1193Provider)
				const signer = await provider.getSigner()
				const slippageTolerance = 10 // 10% slippage
				const tx = await swapTokenForETH(
					provider,
					signer,
					fromAmount,
					slippageTolerance,
					address
				)
				console.log('Swap TOKEN → ETH completed!')

				toast({
					title: 'Swap successful',
					description: 'Transaction id: ' + tx!.hash,
					variant: 'default',
				})

				// Update balances
				await fetchBalance()
				await fetchBalanceToken()

				// reset form
				setFromAmount('')
				setToAmount('')

				// close modal
				onClose()
			}

			// // Clear amounts after successful swap
			// setFromAmount('')
			// setToAmount('')
		} catch (error) {
			console.error('Error during swap:', error)
			// You might want to show an error message to the user here
			toast({
				title: 'Swap failed',
				description: 'Error: ' + error,
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 '
			onClick={handleClose}
			style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
			<div
				className='bg-gradient-to-br from-teal-900 via-cyan-900 to-teal-900 rounded-2xl p-6 w-full max-w-xl border border-gray-800'
				onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<h2 className='text-2xl font-semibold text-foreground'>
						{activeTab === 'buy' ? 'Buy $HYRSTR' : 'Sell $HYPSTR'}
					</h2>
					<div className='flex'>
						<Button
							variant={activeTab === 'buy' ? 'default' : 'ghost'}
							className={`flex-1 mr-2 cursor-pointer ${
								activeTab === 'buy'
									? 'bg-primary hover:bg-primary/80 text-white'
									: 'bg-secondary-foreground hover:bg-secondary-foreground/80 text-background hover:text-background dark:hover:bg-foreground'
							}`}
							onClick={() => handleTabChange('buy')}>
							Buy
						</Button>
						<Button
							variant={activeTab === 'sell' ? 'default' : 'ghost'}
							className={`flex-1 cursor-pointer ${
								activeTab === 'sell'
									? 'bg-primary hover:bg-primary/80 text-white'
									: 'bg-secondary-foreground hover:bg-secondary-foreground/80 text-background hover:text-background dark:hover:bg-foreground'
							}`}
							onClick={() => handleTabChange('sell')}>
							Sell
						</Button>
					</div>
				</div>

				{/* From Section */}
				<div className='mb-4'>
					<div className='flex items-center justify-between mb-2'>
						<span className='text-sm text-gray-400'>From</span>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='sm'
								onClick={handleMaxClick}
								className='text-xs px-2 py-1 bg-primary/20 border-primary/30 dark:border-gray-600 text-primary hover:bg-primary dark:hover:bg-primary cursor-pointer hover:text-white'>
								Max
							</Button>
						</div>
					</div>
					<div className='flex items-center space-x-2'>
						<Input
							type='text'
							placeholder='0.0'
							value={fromAmount}
							onChange={(e) => handleFromAmountChange(e.target.value)}
							className={`flex-1 bg-background border-gray-700 dark:border-gray-600 text-forg placeholder:text-gray-500 ${
								validationError
									? 'border-red-500 focus:border-red-500'
									: 'focus:border-red-500'
							}`}
						/>
						<Button
							variant='outline'
							className='w-36 bg-background border-gray-600 dark:border-gray-600 text-foreground hover:bg-background/80 min-w-[80px] cursor-pointer dark:hover:text-white'>
							<div className='flex items-center space-x-1'>
								{activeTab === 'buy' ? (
									<>
										<Image
											src='/hyper_liquid_icon.svg'
											alt='HYPE'
											width={16}
											height={16}
										/>
										<span>HYPE</span>
									</>
								) : (
									<>
										<div className='w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center'>
											<span className='text-xs font-bold text-white'>C</span>
										</div>
										<span>HYPSTR</span>
									</>
								)}
							</div>
						</Button>
					</div>
					<div className='text-sm text-gray-400 mt-1'>
						Balance:{' '}
						{activeTab === 'buy'
							? `${shortenEthBalance(balance || '0')} HYPE`
							: `${shortenTokenBalance(tokenBalance || '0')} $HYPSTR`}
					</div>
					{validationError && (
						<div className='mt-2 text-sm text-red-400 flex items-center space-x-1'>
							<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
								<path
									fillRule='evenodd'
									d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
									clipRule='evenodd'
								/>
							</svg>
							<span>{validationError}</span>
						</div>
					)}
				</div>

				{/* Swap Button */}
				<div className='flex justify-center mb-4'>
					<Button
						variant='outline'
						size='icon'
						className='bg-background border-gray-600 dark:border-gray-600 hover:bg-primary/80 hover:text-background hover:border-primary text-foreground cursor-pointer dark:hover:text-white '
						onClick={() => handleTabChange(activeTab === 'buy' ? 'sell' : 'buy')}>
						<ArrowUpDown className='h-4 w-4' />
					</Button>
				</div>

				{/* To Section */}
				<div className='mb-6'>
					<div className='flex items-center justify-between mb-2'>
						<span className='text-sm text-gray-400'>To</span>
					</div>
					<div className='flex items-center space-x-2'>
						<Input
							type='text'
							disabled
							placeholder='0.0'
							value={
								activeTab === 'buy'
									? shortenTokenBalance(toAmount || '0')
									: shortenEthBalance(toAmount || '0')
							}
							onChange={(e) => setToAmount(e.target.value)}
							className='bg-background flex-1 dark:bg-gray-800 border-gray-700 text-foreground placeholder:text-gray-500 focus:border-red-500'
						/>
						<Button
							variant='outline'
							className=' w-36 bg-background border-gray-600 	dark:border-gray-600 text-foreground hover:bg-background/80 min-w-[100px] dark:hover:text-white'>
							<div className='flex items-center space-x-1'>
								{activeTab === 'buy' ? (
									<>
										<div className='w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center '>
											<span className='text-xs font-bold text-white'>C</span>
										</div>
										<span>HYPSTR</span>
									</>
								) : (
									<>
										<Image
											src='/hyper_liquid_icon.svg'
											alt='HYPE'
											width={16}
											height={16}
										/>
										<span>HYPE</span>
									</>
								)}
							</div>
						</Button>
					</div>
					<div className='text-sm text-gray-400 mt-1'>
						Balance:{' '}
						{activeTab === 'buy'
							? `${shortenTokenBalance(tokenBalance || '0')} HYPSTR`
							: `${shortenEthBalance(balance || '0')} HYPE`}
					</div>
				</div>

				{/* Action Button */}
				<Button
					onClick={handleSwap}
					className={`w-full font-medium py-3 rounded-xl ${
						validationError
							? 'bg-gray-500 hover:bg-gray-500 cursor-not-allowed'
							: 'bg-primary hover:bg-primary/80'
					} text-white`}
					disabled={!fromAmount || !toAmount || isLoading || !!validationError}>
					{isLoading
						? 'Processing...'
						: validationError
						? 'Insufficient Balance'
						: !fromAmount || !toAmount
						? 'Enter an amount'
						: activeTab === 'buy'
						? 'Buy HYPSTR'
						: 'Sell HYPSTR'}
				</Button>
			</div>
		</div>
	)
}
