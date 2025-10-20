import { NextResponse } from 'next/server'
import { getNFTCheapest, saveNFTCheapest } from '../../../../db/nftCheapest'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export type NFTResult = {
	name: string | null
	image: string | null
	price: number
	owner: string | null
	tokenId: string | null
}

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const contract = searchParams.get('contract')

		if (!contract) {
			return NextResponse.json({ error: 'Missing contract address' }, { status: 400 })
		}

		// get from redis
		let cheapestNFT: NFTResult | null = null
		try {
			cheapestNFT = await getNFTCheapest()
		} catch (redisErr) {
			console.error('⚠️ Redis error, fallback to API:', redisErr)
		}

		if (cheapestNFT) {
			return NextResponse.json(cheapestNFT)
		}

		const API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY || 'demo-api-key'
		const slug = process.env.NEXT_PUBLIC_NFT_SLUG || ''
		// 1. Lấy order rẻ nhất
		const bestListingsRes = await fetch(
			`https://api.opensea.io/api/v2/listings/collection/${slug}/best`,
			{ headers: { 'x-api-key': API_KEY } }
		)
		const bestListingsData = await bestListingsRes.json()

		if (!bestListingsData.listings || bestListingsData.listings.length === 0) {
			return NextResponse.json({ error: 'No active listings found' }, { status: 404 })
		}

		const order = bestListingsData.listings[0]
		const tokenId = order.protocol_data.parameters.offer[0].identifierOrCriteria
		const value = order.price?.current?.value
		const decimals = order.price?.current?.decimals ?? 18
		const listingTokenPrice = value ? Number(value) / 10 ** (decimals ?? 18) : 0

		// get token info
		const tokenInfoRes = await fetch(
			`https://api.opensea.io/api/v2/chain/hyperevm/contract/${contract}/nfts/${tokenId}`,
			{ headers: { 'x-api-key': API_KEY } }
		)
		const tokenInfoData = await tokenInfoRes.json()

		console.log(tokenInfoData)

		// 3. Merge kết quả
		const result: NFTResult = {
			name: tokenInfoData.nft.name || null,
			image: tokenInfoData.nft.image_url || null,
			price: listingTokenPrice || 0,
			owner: tokenInfoData.nft.owners[0]?.address || null,
			tokenId: tokenId,
		}

		// save to redis
		await saveNFTCheapest(result)

		return NextResponse.json(result)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
