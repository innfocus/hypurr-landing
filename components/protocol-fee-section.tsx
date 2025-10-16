'use client'

import { Card } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Label } from 'recharts'
import { shortenEthDynamic } from '../utils/utils'

export function ProtocolFeeSection() {
	const data = [
		{ name: 'partA', value: 80, indicator: 80 },
		{ name: 'partB', value: 20, indicator: 20 },
	]

	const renderOutsideLabel = (props: any) => {
		const RADIAN = Math.PI / 180
		const { cx, cy, midAngle, outerRadius, index } = props
		const x = cx + (outerRadius + 25) * Math.cos(-midAngle * RADIAN)
		const y = cy + (outerRadius + 25) * Math.sin(-midAngle * RADIAN)
		return (
			<text x={x} y={y} dy={4} textAnchor={x > cx ? 'start' : 'end'} fill='#27cbb5'>
				{data[index].indicator}
			</text>
		)
	}

	const [currentPrice, setCurrentPrice] = useState(0)
	const [marketCap, setMarketCap] = useState(0)

	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS

	useEffect(() => {
		const fetchData = async () => {
			const tokenDataRes = await fetch(
				`https://api.geckoterminal.com/api/v2/networks/hyperevm/tokens/${tokenAddress}`
			)
			const tokenDataJson = await tokenDataRes.json()
			setCurrentPrice(parseFloat(tokenDataJson.data.attributes.price_usd))
			setMarketCap(parseFloat(tokenDataJson.data.attributes.market_cap_usd || '0'))
		}
		fetchData()
	}, [tokenAddress])

	return (
		<section className='py-20 px-4 relative overflow-hidden '>
			<div className='container mx-auto max-w-4xl relative z-10 '>
				<div className='text-center mb-4'>
					<h2 className='text-2xl md:text-6xl font-bold mb-6 text-foreground'>
						Protocol Fee
					</h2>

					<div className='flex items-center gap-4 text-sm justify-between'>
						<div className='text-center flex flex-col md:flex-row'>
							<span className='text-muted-foreground mr-1'>Market Cap</span>
							<span className='font-bold text-primary'>
								${marketCap.toLocaleString()}
							</span>
						</div>
						<div className='text-center flex flex-col md:flex-row'>
							<span className='text-muted-foreground mr-1'>$HYRSTR Price</span>
							<span className='font-bold text-primary'>
								${shortenEthDynamic(currentPrice.toString(), 8)}
							</span>
						</div>
					</div>
				</div>

				<Card className='p-8 border border-primary/30 hover:border-primary/60 transition-all duration-300 bg-primary/5 backdrop-blur-md'>
					<div className='flex flex-col items-center gap-6'>
						<ChartContainer
							className='aspect-square h-56 w-56'
							config={{ partA: { color: '#46ecd5' }, partB: { color: '#27cbb5' } }}>
							<PieChart>
								<Pie
									data={[
										{ name: 'partA', value: 80 },
										{ name: 'partB', value: 20 },
									]}
									outerRadius={90}
									paddingAngle={0}
									stroke='transparent'
									dataKey='value'
									labelLine={{ stroke: '#27cbb5', strokeWidth: 1, opacity: 0.8 }}
									label={renderOutsideLabel}>
									<Cell fill='var(--color-partA)' />
									<Cell fill='var(--color-partB)' />
								</Pie>
							</PieChart>
						</ChartContainer>
					</div>
				</Card>

				<div className='text-xs text-center mt-4 font-light'>
					Fees on trades are used to power the accumulating machine, with 80% going to the
					protocol and 20% going to the team. There is a minimum 10% fee on trades. All
					HYPE from Hypur sales is used to buy the token and burn it, moving the HYPE back
					into the LP.
				</div>
			</div>
		</section>
	)
}
