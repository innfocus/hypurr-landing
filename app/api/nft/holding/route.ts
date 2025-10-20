// app/api/nfts/route.ts
import { NextResponse } from 'next/server'
import { getNFTHolding, saveNFTHolding } from '../../../../db/nftHolding'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export interface NFTData {
	name: string
	description: string | null
	attributes: Array<any>
	lastSalePrice: string | null
	owner: string | null
	image: string | null
	tokenId: string
	listingPrice: string | null
	type: string | null
	openseaLink: string | null
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const contract = searchParams.get('contract') // collection address
		const wallet = searchParams.get('wallet') // optional: filter by owner
		const limit = searchParams.get('limit')

		if (!contract) {
			return NextResponse.json({ error: 'Missing contract param' }, { status: 400 })
		}

		if (!wallet) {
			return NextResponse.json({ error: 'Missing wallet param' }, { status: 400 })
		}

		// get from redis
		let nftsHolding: NFTData[] | null = null
		try {
			nftsHolding = await getNFTHolding()
		} catch (redisErr) {
			console.error('⚠️ Redis error, fallback to API:', redisErr)
		}

		if (nftsHolding && nftsHolding.length > 0) {
			return NextResponse.json({
				source: 'cache',
				data: nftsHolding,
			})
		}

		const API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY || 'demo-api-key'
		const slug = process.env.NEXT_PUBLIC_NFT_SLUG || ''
		// 1. Lấy order rẻ nhất
		const nftHoldingRes = await fetch(
			`https://api.opensea.io/api/v2/chain/hyperevm/account/${wallet}/nfts?collection=${slug}`,
			{ headers: { 'x-api-key': API_KEY } }
		)

		const holdingData = await nftHoldingRes.json()

		const nftsData = holdingData.nfts

		const nftEventsPromises = holdingData.nfts.map(async (nft: any) => {
			const nftEventsRes = await fetch(
				`https://api.opensea.io/api/v2/events/chain/hyperevm/contract/${contract}/nfts/${nft.identifier}?event_type=sale&event_type=listing`,
				{ headers: { 'x-api-key': API_KEY } }
			)
			const nftEventsData = await nftEventsRes.json()
			const events = nftEventsData.asset_events || []
			const lastSaleEvent = events.find((e: any) => e.event_type === 'sale')

			let lastSalePrice = null
			let listingPrice = null
			let type = null

			const lastEvent = events[0]

			if (lastEvent?.event_type === 'sale') {
				lastSalePrice =
					Number(lastEvent.payment.quantity) / 10 ** (lastEvent.payment.decimals || 18)
				type = 'sale'
			} else {
				listingPrice =
					Number(lastEvent.payment.quantity) / 10 ** (lastEvent.payment.decimals || 18)
				type = 'listing'
			}

			return {
				tokenId: nft.identifier,
				lastSalePrice: lastSalePrice,
				type: type,
				listingPrice: listingPrice,
			}
		})

		const eventResults = await Promise.all(nftEventsPromises)

		const results: NFTData[] = (nftsData || []).map((nft: any) => {
			const eventResult = eventResults.find((e: any) => e.tokenId === nft.identifier)
			return {
				name: nft.name || '',
				description: nft.description || null,
				attributes: nft.raw?.metadata?.attributes || [],
				lastSalePrice: eventResult?.lastSalePrice ?? null,
				type: eventResult?.type ?? null,
				listingPrice: eventResult?.listingPrice ?? null,
				owner: wallet,
				image: nft.image_url || null,
				tokenId: nft.identifier ?? null,
				openseaLink: nft.opensea_url ?? null,
			}
		})

		// save to redis
		await saveNFTHolding(results)

		return NextResponse.json(results)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
