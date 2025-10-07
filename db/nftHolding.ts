import client from '@/lib/redis'

const key = 'nft-holding'

export async function saveNFTHolding(value: any) {
	await client.set(key, JSON.stringify(value), 'EX', 600)
}

export async function getNFTHolding() {
	const data = await client.get(key)
	return data ? JSON.parse(data) : null
}
