export const shortenEthAddress = (address: string): string => {
	if (address.length !== 42) {
		return '0x...'
	}

	const start = address.substring(0, 4 + 2)
	const end = address.substring(address.length - 4)

	return `${start}...${end}`
}

export const shortenEthBalance = (balance: string, decimals: number = 4): string => {
	const balanceNumber = parseFloat(balance)

	if (isNaN(balanceNumber)) {
		return '0'
	}

	const fixed = balanceNumber.toFixed(decimals)
	return parseFloat(fixed).toString()
}

export const shortenEthDynamic = (balance: string, decimals: number = 4): string => {
	const balanceNumber = parseFloat(balance)

	if (isNaN(balanceNumber)) {
		return '0'
	}

	const dynamicDecimals = balanceNumber >= 0.01 ? Math.min(2, decimals) : decimals

	const fixed = balanceNumber.toFixed(dynamicDecimals)
	return parseFloat(fixed).toString()
}

export const shortenTokenBalance = (balance: string, decimals: number = 2): string => {
	const balanceNumber = parseFloat(balance)

	if (isNaN(balanceNumber)) {
		return '0'
	}

	if (balanceNumber === 0) {
		return '0'
	}

	const fixed = balanceNumber.toFixed(decimals)
	return parseFloat(fixed).toString()
}
export const fmtPercent = (ratio: number, fractionDigits = 0) =>
	new Intl.NumberFormat('vi-VN', {
		style: 'percent',
		minimumFractionDigits: 0,
		maximumFractionDigits: fractionDigits,
	}).format(Math.max(0, Math.min(1, ratio)))

export const calculateRemainEth = (currentBalance: string, cheapestCloneX: number) => {
	return cheapestCloneX - parseFloat(currentBalance)
}
