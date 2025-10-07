import {
	BrowserProvider,
	Contract,
	formatEther,
	formatUnits,
	JsonRpcProvider,
	parseUnits,
} from 'ethers'
import { TOKEN_ABI, TOKEN_ADDRESS } from './tokenData'
import { RPC_URL } from '../../constants/constants'

export interface TokenInteraction {
	getBalance: (address: string) => Promise<string>
	getAllowance: (owner: string, spender: string) => Promise<string>
	approve: (spender: string, amount: string) => Promise<any>
	getHookAddress: () => Promise<string>
	getReward: () => Promise<string>
	buyNftWithEth: (contract: string, tokenId: string) => Promise<any>
}

export class TokenContract implements TokenInteraction {
	private contract: Contract
	private provider: BrowserProvider | JsonRpcProvider
	private signer?: any

	// overload signatures
	constructor(walletProvider: any)
	constructor()

	constructor(walletProvider?: any) {
		// Validate token address
		if (!TOKEN_ADDRESS || TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
			throw new Error(
				'Token address not configured. Please set NEXT_PUBLIC_TOKEN_ADDRESS environment variable.'
			)
		}

		if (walletProvider) {
			this.provider = new BrowserProvider(walletProvider as any)
			this.contract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, this.provider)
		} else {
			this.provider = new JsonRpcProvider(RPC_URL)
			this.contract = new Contract(TOKEN_ADDRESS, TOKEN_ABI, this.provider)
		}
	}

	async initialize() {
		this.signer = await this.provider.getSigner()
		this.contract = this.contract.connect(this.signer) as Contract
	}

	// Read functions
	async getBalance(address: string): Promise<string> {
		try {
			const balance = await this.contract.balanceOf(address)
			return formatUnits(balance, 18)
		} catch (error) {
			console.error('Error fetching token balance:', error)
			return '0'
		}
	}

	async getAllowance(owner: string, spender: string): Promise<string> {
		try {
			const allowance = await this.contract.allowance(owner, spender)
			return formatUnits(allowance, 18)
		} catch (error) {
			console.error('Error fetching token allowance:', error)
			return '0'
		}
	}

	// Write functions
	async approve(spender: string, amount: string): Promise<any> {
		const amountWei = parseUnits(amount, 18)
		const tx = await this.contract.approve(spender, amountWei)
		return await tx.wait()
	}

	async getHookAddress(): Promise<string> {
		const result = await this.contract.hookAddress()
		return result
	}

	async getReward(): Promise<string> {
		try {
			const result = await this.contract.reward()
			// console.log(result)
			return formatEther(result)
		} catch {
			return '0'
		}
	}

	async buyNftWithEth(contract: string, tokenId: string): Promise<any> {
		const bestOffer = await fetch(
			`/api/nft/best-listing?contract=${contract}&tokenId=${tokenId}`
		)
		const bestOfferData = await bestOffer.json()

		const fulfillBody = {
			hash: bestOfferData.order_hash,
			address: TOKEN_ADDRESS,
			tokenId: tokenId,
		}

		const fulfillOrder = await fetch(`/api/nft/fulfill-order`, {
			method: 'POST',
			body: JSON.stringify(fulfillBody),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const fulfillOrderData = await fulfillOrder.json()

		const txEnvelope = fulfillOrderData?.fulfillment_data?.transaction
		const params = txEnvelope?.input_data?.parameters
		if (!txEnvelope || !params) {
			throw new Error('Transaction data not found')
		}

		if (!this.signer) {
			await this.initialize()
		}

		const txData = {
			...params,
			considerationIdentifier: BigInt(params.considerationIdentifier),
			considerationAmount: BigInt(params.considerationAmount),
			offerIdentifier: BigInt(params.offerIdentifier),
			offerAmount: BigInt(params.offerAmount),
			startTime: BigInt(params.startTime),
			endTime: BigInt(params.endTime),
			salt: BigInt(params.salt),
			totalOriginalAdditionalRecipients: BigInt(params.totalOriginalAdditionalRecipients),
			additionalRecipients: params.additionalRecipients.map((r: any) => ({
				amount: BigInt(r.amount),
				recipient: r.recipient,
			})),
		}

		const tx = await this.contract.fulfillBasicOrder_efficient_6GL6yc(txData)

		return await tx.wait()
	}
}

// Factory function to create token contract instance
export const createTokenContract = async (walletProvider?: any): Promise<TokenContract> => {
	try {
		const contract = new TokenContract(walletProvider)
		if (walletProvider) {
			await contract.initialize()
		}
		return contract
	} catch (error) {
		console.error('Error creating token contract:', error)
		throw error
	}
}

// Utility functions for common operations
export const tokenUtils = {
	async getBalance(): Promise<string> {
		const provider = new JsonRpcProvider(RPC_URL)
		const balanceWei = await provider.getBalance(TOKEN_ADDRESS)
		const balance = formatEther(balanceWei)
		return balance
	},

	// Get user's token balance
	async getTokenBalance(userAddress: string): Promise<string> {
		try {
			const contract = await createTokenContract()
			return await contract.getBalance(userAddress)
		} catch (error) {
			console.error('Error getting token balance:', error)
			return '0'
		}
	},

	// Check if user has enough allowance for a spender
	async checkAllowance(
		walletProvider: any,
		owner: string,
		spender: string,
		requiredAmount: string
	): Promise<boolean> {
		const contract = await createTokenContract(walletProvider)
		const allowance = await contract.getAllowance(owner, spender)
		return parseFloat(allowance) >= parseFloat(requiredAmount)
	},

	// Approve tokens for spending
	async approveTokens(walletProvider: any, spender: string, amount: string): Promise<any> {
		const contract = await createTokenContract(walletProvider)
		return await contract.approve(spender, amount)
	},

	// Get hook address
	async getHookAddress(): Promise<string> {
		const contract = await createTokenContract()
		const result = await contract.getHookAddress()
		return result
	},

	async getReward(): Promise<string> {
		const contract = await createTokenContract()
		return await contract.getReward()
	},

	async buyNftWithEth(walletProvider: any, nftContract: string, tokenId: string): Promise<any> {
		const contract = await createTokenContract(walletProvider)
		await contract.initialize()
		return await contract.buyNftWithEth(nftContract, tokenId)
	},
}
