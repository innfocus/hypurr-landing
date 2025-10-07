import client from '@/lib/redis'

const key = 'nft-cheapest'

export async function saveNFTCheapest(value: any) {
	await client.set(key, JSON.stringify(value), 'EX', 600)
}

export async function getNFTCheapest() {
	const data = await client.get(key)
	return data ? JSON.parse(data) : null
}
