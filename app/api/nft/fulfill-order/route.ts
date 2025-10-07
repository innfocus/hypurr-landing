import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { hash, address } = await req.json()

		console.log(hash, address)
		const offerBody = {
			listing: {
				hash: hash,
				chain: 'ethereum',
				protocol_address: '0x0000000000000068f116a894984e2db1123eb395',
			},
			fulfiller: {
				address: address,
			},
		}

		const fulfillRes = await fetch(`https://api.opensea.io/api/v2/listings/fulfillment_data`, {
			headers: {
				'X-API-KEY': 'bd9acfa504f4415ab9d33c586f1a92a3',
				'Content-Type': 'application/json',
			},
			method: 'POST',
			body: JSON.stringify(offerBody),
		})

		const fulfillData = await fulfillRes.json()

		return NextResponse.json(fulfillData)
	} catch (error) {
		console.error(error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
