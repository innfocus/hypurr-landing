import client from '@/lib/redis'

const key = 'nft-sold'

export async function saveNFTSold(value: any) {
	await client.set(key, JSON.stringify(value), 'EX', 600)
}

export async function getNFTSold() {
	const data = await client.get(key)
	return data ? JSON.parse(data) : null
}
