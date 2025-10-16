import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import TradingviewWidget from '../../components/tradingview-widget'
import { Button } from '../../components/ui/button'
import { useSwapModal } from '../../context/swap-modal-context'

const TradingChartSection = () => {
	const { openModal } = useSwapModal()

	return (
		<Card className=' max-w-7xl mx-auto bg-transparent mb-6'>
			<CardHeader>
				<CardTitle className=''>
					<div className='text-center text-2xl font-bold'>HYRSTR/USD Trading Chart</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='relative rounded-lg border border-border/50 overflow-hidden bg-background'>
					<TradingviewWidget />
				</div>
				<div className='mt-6'>
					<Button
						className='bg-primary/60  text-white font-bold max-w-xs mx-auto block shadow-lg cursor-pointer'
						onClick={() => openModal()}>
						Buy $HYRSTR
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

export default TradingChartSection
