'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Sun, Moon, RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { shortenEthAddress } from '../utils/utils'
import { useSwapModal } from '../context/swap-modal-context'
import { usePathname } from 'next/navigation'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from '@/components/ui/sheet'

export function Navigation() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const { open } = useAppKit()
	const { address, isConnected } = useAppKitAccount()
	const [theme, setThemeState] = useState<'light' | 'dark'>('dark')
	const [mounted, setMounted] = useState(false)
	const { openModal } = useSwapModal()

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		setMounted(true)
		const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
		if (savedTheme) {
			setThemeState(savedTheme)
			document.documentElement.classList.toggle('dark', savedTheme === 'dark')
		} else {
			// Default to dark theme
			setThemeState('dark')
			document.documentElement.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		}
		console.log('[v0] Theme initialized:', savedTheme || 'dark')
	}, [])

	const toggleTheme = () => {
		if (!mounted) return

		const newTheme = theme === 'dark' ? 'light' : 'dark'
		console.log('[v0] Toggling theme from', theme, 'to', newTheme)

		setThemeState(newTheme)
		localStorage.setItem('theme', newTheme)

		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}

		console.log('[v0] Theme toggled. Document class:', document.documentElement.className)
	}

	const currentPath = usePathname()

	if (!mounted) {
		return (
			<nav className='fixed top-0 w-full z-50 transition-all duration-300 bg-transparent'>
				<div className='container mx-auto px-4 py-4'>
					<div className='flex items-center justify-between'>
						<Link
							href='/'
							className='text-2xl font-bold neon-text text-primary hover:opacity-80 transition-opacity'>
							MurakamiStrategy
						</Link>
						<div className='hidden md:flex items-center space-x-8'>
							<div className='flex items-center gap-2'>
								<Sun className='h-5 w-5' />
								<label className='inline-flex items-center cursor-pointer'>
									<input
										type='checkbox'
										value=''
										className='sr-only peer'
										checked={theme === 'dark'}
										onChange={toggleTheme}
									/>
									<div className="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
								</label>
								<Moon className='h-5 w-5' />
							</div>
						</div>
						<div className='md:hidden flex items-center space-x-2'>
							<Button variant='ghost' size='icon' disabled>
								<Sun className='h-5 w-5' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
								{isMobileMenuOpen ? <X /> : <Menu />}
							</Button>
						</div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav
			className={`fixed top-0 w-full z-50 transition-all duration-300 ${
				isScrolled
					? 'bg-background/80 backdrop-blur-md border-b border-border'
					: 'bg-transparent'
			}`}>
			<div className='container mx-auto px-4 py-4'>
				<div className='flex items-center justify-between'>
					<Link
						href='/'
						className='text-xs md:text-2xl  font-bold neon-text text-primary hover:opacity-80 transition-opacity'>
						MurakamiStrategy
					</Link>

					{/* Desktop Menu */}
					<div className='hidden md:flex items-center space-x-4'>
						<div className='flex items-center gap-2'>
							<Sun className='h-5 w-5' />
							<label className='inline-flex items-center cursor-pointer'>
								<input
									type='checkbox'
									value=''
									className='sr-only peer'
									checked={theme === 'dark'}
									onChange={toggleTheme}
								/>
								<div className="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
							</label>
							<Moon className='h-5 w-5' />
						</div>

						{currentPath != '/' && isConnected && (
							<Button
								onClick={openModal}
								className='text-foreground transition-colors cursor-pointer border border-primary/20 px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-2 bg-transparent'>
								<RefreshCcw className='dark:text-white h-4 w-4' />
								Swap
							</Button>
						)}

						{currentPath == '/' ? (
							<Button
								className='bg-primary text-white dark:text-background hover:bg-primary/90 transition-colors cursor-pointer'
								onClick={() => {
									window.location.href = '/app'
								}}>
								Enter App
							</Button>
						) : isConnected ? (
							<Button
								className='text-foreground transition-colors cursor-pointer border border-primary/20 px-2 py-1 rounded-md text-sm font-semibold bg-transparent'
								onClick={() => open()}>
								{shortenEthAddress(address || '')}
							</Button>
						) : (
							<Button
								className='bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer dark:text-background'
								onClick={() => open()}>
								Connect Wallet
							</Button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className='md:hidden flex items-center space-x-2'>
						{/* Mobile drawer */}
						<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<SheetTrigger asChild>
								<div>
									{/* {isConnected ? (
										<Button
											className='text-foreground transition-colors cursor-pointer border border-red-500/20 px-2 py-1 rounded-md text-sm font-semibold bg-transparent'
											onClick={() => open()}>
											{shortenEthAddress(address || '')}
										</Button>
									) : (
										<Button
											className='bg-primary text-white dark:text-background hover:bg-primary/90 transition-colors cursor-pointer'
											onClick={() => open()}>
											Connect Wallet
										</Button>
									)} */}
									<Button
										variant='ghost'
										size='icon'
										className='text-foreground transition-colors hover:bg-primary/30'>
										<Menu className='h-5 w-5' />
									</Button>
								</div>
							</SheetTrigger>
							<SheetContent
								side='right'
								className='bg-background/95 backdrop-blur-md border-l border-border p-4'>
								<SheetHeader className='p-0'>
									<Link
										href='/'
										onClick={() => setIsMobileMenuOpen(false)}
										className='text-xs font-bold neon-text text-primary '>
										MurakamiStrategy
									</Link>
								</SheetHeader>

								<div className='mt-6 flex flex-col gap-4'>
									{currentPath === '/' ? (
										<SheetClose asChild>
											<Button
												className='w-full bg-primary text-white hover:bg-primary/90 dark:text-background'
												onClick={() => {
													window.location.href = '/app'
												}}>
												Enter app
											</Button>
										</SheetClose>
									) : (
										<SheetClose asChild>
											<Button
												className='w-full bg-primary text-white dark:text-background hover:bg-primary/90'
												onClick={() => {
													window.location.href = '/'
												}}>
												Home
											</Button>
										</SheetClose>
									)}

									{currentPath !== '/' && isConnected && (
										<Button
											variant='outline'
											className='justify-between w-full border border-primary/20 text-foreground'
											onClick={() => {
												openModal()
												setIsMobileMenuOpen(false)
											}}>
											<div className='flex items-center gap-2'>
												<RefreshCcw className='h-4 w-4' />
												Swap
											</div>
										</Button>
									)}

									<div className='w-full rounded-md border border-border p-3'>
										<div className='flex items-center justify-between'>
											<span className='text-sm'>Theme</span>
											<div className='flex items-center gap-2'>
												<Sun className='h-4 w-4' />
												<label className='inline-flex items-center cursor-pointer'>
													<input
														type='checkbox'
														value=''
														className='sr-only peer'
														checked={theme === 'dark'}
														onChange={() => {
															toggleTheme()
														}}
													/>
													<div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
												</label>
												<Moon className='h-4 w-4' />
											</div>
										</div>
									</div>

									{isConnected ? (
										<Button
											variant='outline'
											className='w-full border-border text-foreground'
											onClick={() => {
												open() // wallet modal usually includes disconnect
												setIsMobileMenuOpen(false)
											}}>
											Disconnect {shortenEthAddress(address || '')}
										</Button>
									) : (
										<Button
											className='bg-primary text-white dark:text-background hover:bg-primary/90 transition-colors cursor-pointer'
											onClick={() => open()}>
											Connect Wallet
										</Button>
									)}
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>
		</nav>
	)
}
