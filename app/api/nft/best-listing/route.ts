import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const contract = searchParams.get('contract')
		const tokenId = searchParams.get('tokenId')

		const slugRes = await fetch(
			`https://api.opensea.io/api/v2/chain/ethereum/contract/${contract}`,
			{
				headers: {
					'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
				},
			}
		)

		const slugData = await slugRes.json()

		const slug = slugData.collection

		const bestOfferRes = await fetch(
			`https://api.opensea.io/api/v2/listings/collection/${slug}/nfts/${tokenId}/best`,
			{
				headers: {
					'X-API-KEY': process.env.NEXT_PUBLIC_OPENSEA_API_KEY || '',
				},
			}
		)

		const bestOfferData = await bestOfferRes.json()

		return NextResponse.json(bestOfferData)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
