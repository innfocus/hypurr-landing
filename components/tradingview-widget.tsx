// TradingViewWidget.jsx
import React, { useEffect, useRef, memo, useState } from 'react'

function TradingViewWidget() {
	const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		setIsMobile(window.innerWidth < 768)
	}, [])

	return (
		<div style={{ position: 'relative', width: '100%', height: isMobile ? '300px' : '600px' }}>
			<iframe
				id='geckoterminal-embed'
				title='GeckoTerminal Embed'
				src={`https://www.geckoterminal.com/hyperevm/pools/${tokenAddress}?embed=1&info=0&swaps=0&light_chart=0&chart_type=price&resolution=15m&bg_color=111827`}
				frameBorder='0'
				allow='clipboard-write'
				allowFullScreen
				style={{ width: '100%', height: '100%' }}></iframe>
		</div>
	)
}

export default memo(TradingViewWidget)
