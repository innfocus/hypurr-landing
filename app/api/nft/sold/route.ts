import { NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

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
	openseaLink: string | null
}

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
				return NextResponse.json({ data: [], message: '⚠️ No sold NFTs fetched' })
			}
			await saveNFTSold(soldNFTs)
			return NextResponse.json({
				data: soldNFTs,
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
				data: sold,
				message: '✅ Fetched fresh data (cache empty or expired)',
			})
		}

		sold = cached

		return NextResponse.json({
			data: sold,
			message: '✅ Fetched data from cache',
		})
	} catch (err) {
		console.error(err)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}

export async function fetchSoldNFTs(): Promise<SoldNFT[]> {
	const API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY || 'demo-api-key'
	const slug = process.env.NFT_SLUG || ''

	const res = await fetch(
		`https://api.opensea.io/api/v2/events/accounts/${OWNER}?event_type=sale&chain=hyperevm`,
		{ headers: { 'x-api-key': API_KEY } }
	)
	if (!res.ok) {
		throw new Error(` API error: ${res.status}`)
	}
	const data = await res.json()
	let soldNfts = (data.asset_events || []).filter(
		(item: any) =>
			item.seller?.toLowerCase() === OWNER?.toLowerCase() &&
			item.nft?.contract?.toLowerCase() === COLLECTION?.toLowerCase()
	)

	//Map data with boughtPrice and soldPrice
	const finalData = soldNfts.map((sold: any) => {
		const tokenId = sold.nft?.identifier

		const name = sold.nft?.name
		const description = sold.nft?.description
		const attributes = null
		const buyer = sold.buyer
		const soldPrice = Number(sold.payment.quantity) / 10 ** (sold.payment.decimals || 18)
		const boughtPrice = null
		const image = sold.nft?.image_url
		const transactionHash = sold.transaction

		return {
			name: name || '',
			description: description || null,
			attributes: attributes || [],
			buyer: buyer || null,
			soldPrice: soldPrice || null,
			boughtPrice: boughtPrice || null,
			image: image || null,
			tokenId: tokenId,
			transactionHash: transactionHash,
			blockTimestamp: sold.event_timestamp,
			openseaLink: sold.nft?.opensea_url || null,
		} as SoldNFT
	})

	console.log(finalData)

	return finalData
}
