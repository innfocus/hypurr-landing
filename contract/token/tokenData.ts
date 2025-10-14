import { ChainId, Token } from '@uniswap/sdk-core'
import { isMainnet } from '../../constants/constants'

// import { ChainId, Token } from '@uniswap/sdk-core'
export const TOKEN_ADDRESS =
	process.env.NEXT_PUBLIC_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000'

export const TOKEN_INFO = new Token(
	isMainnet ? ChainId.MAINNET : ChainId.SEPOLIA,
	TOKEN_ADDRESS,
	18,
	'HYPSTR',
	'HYPSTR'
)

export const TOKEN_ABI = [
	{
		inputs: [
			{ internalType: 'string', name: 'name_', type: 'string' },
			{ internalType: 'string', name: 'symbol_', type: 'string' },
			{ internalType: 'uint256', name: 'supply_', type: 'uint256' },
			{ internalType: 'address', name: 'marketing_', type: 'address' },
			{ internalType: 'address', name: 'router_', type: 'address' },
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'allowance', type: 'uint256' },
			{ internalType: 'uint256', name: 'needed', type: 'uint256' },
		],
		name: 'ERC20InsufficientAllowance',
		type: 'error',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'sender', type: 'address' },
			{ internalType: 'uint256', name: 'balance', type: 'uint256' },
			{ internalType: 'uint256', name: 'needed', type: 'uint256' },
		],
		name: 'ERC20InsufficientBalance',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'approver', type: 'address' }],
		name: 'ERC20InvalidApprover',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'receiver', type: 'address' }],
		name: 'ERC20InvalidReceiver',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
		name: 'ERC20InvalidSender',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'spender', type: 'address' }],
		name: 'ERC20InvalidSpender',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
		name: 'OwnableInvalidOwner',
		type: 'error',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'OwnableUnauthorizedAccount',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'spender', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'uint16', name: 'buyFee', type: 'uint16' },
			{ indexed: false, internalType: 'uint16', name: 'sellFee', type: 'uint16' },
		],
		name: 'FeesUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [{ indexed: false, internalType: 'address', name: 'wallet', type: 'address' }],
		name: 'MarketingWalletUpdated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: false, internalType: 'uint256', name: 'tokensSwapped', type: 'uint256' },
			{ indexed: false, internalType: 'uint256', name: 'ethReceived', type: 'uint256' },
		],
		name: 'SwapBackExecuted',
		type: 'event',
	},
	{ anonymous: false, inputs: [], name: 'TradingEnabled', type: 'event' },
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'buyFee',
		outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'enableTrading',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'isExempt',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: '', type: 'address' }],
		name: 'isPair',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'manualSwap',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'marketingWallet',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'pair',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ inputs: [], name: 'rescueETH', outputs: [], stateMutability: 'nonpayable', type: 'function' },
	{
		inputs: [{ internalType: 'address', name: 'token_', type: 'address' }],
		name: 'rescueTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'router',
		outputs: [{ internalType: 'contract IHyperSwapRouter', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'sellFee',
		outputs: [{ internalType: 'uint16', name: '', type: 'uint16' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'account_', type: 'address' },
			{ internalType: 'bool', name: 'exempt_', type: 'bool' },
		],
		name: 'setExempt',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint16', name: 'buy_', type: 'uint16' },
			{ internalType: 'uint16', name: 'sell_', type: 'uint16' },
		],
		name: 'setFees',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'wallet_', type: 'address' }],
		name: 'setMarketingWallet',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'pair_', type: 'address' }],
		name: 'setPair',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'bool', name: 'enabled_', type: 'bool' },
			{ internalType: 'uint256', name: 'threshold_', type: 'uint256' },
		],
		name: 'setSwapSettings',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapEnabled',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'swapThreshold',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'tradingEnabled',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'value', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'withdrawTokens',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{ stateMutability: 'payable', type: 'receive' },
]
