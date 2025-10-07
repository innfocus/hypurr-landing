import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type React from 'react'
import { Suspense } from 'react'
import { AppKitContext } from '../context/appkit'
import { SwapModalProvider } from '../context/swap-modal-context'
import './globals.css'

export const metadata: Metadata = {
	title: 'Hypurr Strategy',
	description:
		'Enter the Hypurr universe. Premium NFT collection featuring futuristic avatars and digital identity.',
	generator: 'v0.app',
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon.ico',
	},
}

const font = localFont({
	src: [
		{
			path: '../public/fonts/Geist-VariableFont_wght.ttf',
			weight: '100 900',
			style: 'normal',
		},
		{
			path: '../public/fonts/Geist-VariableFont_wght.ttf',
			weight: '100 900',
			style: 'italic',
		},
	],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`font-sans ${font.className} antialiased relative`}>
				<AppKitContext>
					<SwapModalProvider>
						<ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
							<div className='relative z-10'>
								<Suspense fallback={null}>{children}</Suspense>
							</div>
							<Toaster />
						</ThemeProvider>
					</SwapModalProvider>
					<Analytics />
				</AppKitContext>
			</body>
		</html>
	)
}
