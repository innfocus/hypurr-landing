export interface SoldNFT {
	name: string
	description: string | null
	attributes: Array<any>
	buyer: string | null
	soldPrice: string | null
	boughtPrice: string | null
	image: string | null
	tokenId: string
	transactionHash: string
	blockTimestamp: string
}

import { NextResponse } from 'next/server'
import { getNFTSold, saveNFTSold } from '../../../../db/nftSold'

const OWNER = process.env.NEXT_PUBLIC_OWNER_ADDRESS
const COLLECTION = process.env.NEXT_PUBLIC_NFT_ADDRESS

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const force = searchParams.get('force') === 'true'

		if (force) {
			const soldNFTs = await fetchSoldNFTs()
			if (!soldNFTs || soldNFTs.length === 0) {
				return NextResponse.json({ sold: [], message: '⚠️ No sold NFTs fetched' })
			}
			await saveNFTSold(soldNFTs)
			return NextResponse.json({
				sold: soldNFTs,
				message: '✅ Fresh data fetched and cache updated',
			})
		}

		let cached = null
		try {
			cached = await getNFTSold()
		} catch (redisErr) {
			console.error('⚠️ Redis error, fallback to API:', redisErr)
		}

		let sold: any[] = []
		if (cached === null) {
			const soldNFTs = await fetchSoldNFTs()
			await saveNFTSold(soldNFTs || [])
			console.log(soldNFTs)
			sold = soldNFTs || []
			return NextResponse.json({
				sold,
				message: '✅ Fetched fresh data (cache empty or expired)',
			})
		}

		sold = cached

		return NextResponse.json({
			sold,
			message: '✅ Fetched data from cache',
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

export async function fetchSoldNFTs(): Promise<SoldNFT[]> {
	const res = await fetch(
		`https://deep-index.moralis.io/api/v2.2/wallets/${OWNER}/nfts/trades?chain=eth&limit=25&nft_metadata=true`,
		{
			headers: {
				'X-API-Key': process.env.NEXT_MORALIS_API_KEY || '',
				Accept: 'application/json',
			},
		}
	)
	if (!res.ok) {
		throw new Error(`Moralis API error: ${res.status}`)
	}
	const data = await res.json()
	let soldNfts = (data.result || []).filter(
		(item: any) =>
			item.seller_address?.toLowerCase() === OWNER?.toLowerCase() &&
			item.token_address?.toLowerCase() === COLLECTION?.toLowerCase()
	)

	// filter transaction duplicated - keep the one with minimum price
	const uniqueTransactions = new Map()

	soldNfts.forEach((item: any) => {
		const hash = item.transaction_hash
		const price = parseFloat(item.price_formatted)

		if (
			!uniqueTransactions.has(hash) ||
			price < parseFloat(uniqueTransactions.get(hash).price_formatted)
		) {
			uniqueTransactions.set(hash, item)
		}
	})

	soldNfts = Array.from(uniqueTransactions.values())

	//Map data with boughtPrice and soldPrice
	const finalData = soldNfts.map((sold: any) => {
		const tokenId = sold.token_ids[0]

		const boughtTxs = (data.result || []).filter(
			(t: any) =>
				t.buyer_address.toLowerCase() === OWNER?.toLowerCase() &&
				t.token_address.toLowerCase() === COLLECTION?.toLowerCase() &&
				t.token_ids[0] === tokenId
		)

		const boughtTx = boughtTxs
			.filter((t: any) => new Date(t.block_timestamp) < new Date(sold.block_timestamp))
			.sort(
				(a: any, b: any) =>
					new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime()
			)[0]

		return {
			name: sold.metadata?.name || '',
			description: sold.metadata?.description || null,
			attributes: sold.metadata?.attributes || [],
			buyer: sold.buyer_address || null,
			soldPrice: sold.price_formatted || null,
			boughtPrice: boughtTx ? boughtTx.price_formatted : null,
			image: sold.metadata?.image || null,
			tokenId: tokenId,
			transactionHash: sold.transaction_hash,
			blockTimestamp: sold.block_timestamp,
		} as SoldNFT
	})

	console.log(finalData)

	return finalData
}
