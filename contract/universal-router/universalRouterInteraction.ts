import { BrowserProvider, Contract, ethers, parseUnits } from 'ethers'
import { UNIVERSAL_ROUTER_ABI, UNIVERSAL_ROUTER_ADDRESS } from './universalRouterData'
import { GetSwapExactInSingleParams } from '../quoter/quoter_interaction'
import { Actions, SwapExactInSingle, V4Planner } from '@uniswap/v4-sdk'
import { ETH_TOKEN } from '../eth_token/ethTokenData'
import { TOKEN_ABI, TOKEN_INFO } from '../token/tokenData'
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk'
import { PERMIT2_ABI, PERMIT2_ADDRESS } from '../permit2/permit2_data'

export class UniversalRouterContract {
    private universalRouterContract: Contract
    private provider: BrowserProvider
    private signer: any
    private hooks: string
    private deadline: number

    constructor(walletProvider: any, hooks: string) {
        this.provider = new BrowserProvider(walletProvider as any)
        this.universalRouterContract = new Contract(
            UNIVERSAL_ROUTER_ADDRESS,
            UNIVERSAL_ROUTER_ABI,
            this.provider
        )
        this.hooks = hooks
        // deadline in seconds (24 hours from now)
        this.deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 24
    }

    getSwapExactInSingle({
        amountIn,
        zeroForOne = true,
        amountOutMinimum = '0',
    }: {
        amountIn: string
        zeroForOne?: boolean
        amountOutMinimum?: string
    }): SwapExactInSingle {
        const amountInBigInt = parseUnits(amountIn, TOKEN_INFO.decimals)
        const minOutBigInt = parseUnits(amountOutMinimum, ETH_TOKEN.decimals)

        return {
            poolKey: {
                currency0: ETH_TOKEN.address,
                currency1: TOKEN_INFO.address,
                fee: 0,
                tickSpacing: 60,
                hooks: this.hooks,
            },
            zeroForOne: zeroForOne,
            amountIn: amountInBigInt.toString(),
            amountOutMinimum: minOutBigInt.toString(),
            hookData: '0x',
        }
    }

    async initialize() {
        this.signer = await this.provider.getSigner()
        this.universalRouterContract = this.universalRouterContract.connect(this.signer) as Contract
    }

    async executeSwapZeroForOne({
        amountIn,
        amountOutMinimum,
    }: {
        amountIn: string
        amountOutMinimum: string
    }) {
        try {
            console.log('swap')
            const v4Planner = new V4Planner()
            const routePlanner = new RoutePlanner()

            const currentConfig = this.getSwapExactInSingle({
                amountIn,
                zeroForOne: true,
                amountOutMinimum,
            })

            v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [currentConfig])
            v4Planner.addAction(Actions.SETTLE_ALL, [
                currentConfig.poolKey.currency0,
                currentConfig.amountIn,
            ])
            v4Planner.addAction(Actions.TAKE_ALL, [
                currentConfig.poolKey.currency1,
                currentConfig.amountOutMinimum,
            ])
            routePlanner.addCommand(CommandType.V4_SWAP, [v4Planner.actions, v4Planner.params])

            const encodedActions = v4Planner.finalize()

            const txOptions: any = {
                value: currentConfig.amountIn,
            }

            console.log('execute Swap')

            const tx = await this.universalRouterContract.execute(
                routePlanner.commands,
                [encodedActions],
                this.deadline,
                txOptions
            )

            const receipt = await tx.wait()

            return receipt
        } catch (error) {
            console.error('Error executing swap:', error)
            throw error
        }
    }

    async executeSwapOneForZero({
        amountIn,
        amountOutMinimum,
    }: {
        amountIn: string
        amountOutMinimum: string
    }) {
        try {
            console.log('swap')
            const v4Planner = new V4Planner()
            const routePlanner = new RoutePlanner()

            await this.approveToken(amountIn)

            const currentConfig = this.getSwapExactInSingle({
                amountIn,
                zeroForOne: false,
                amountOutMinimum,
            })

            v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [currentConfig])
            v4Planner.addAction(Actions.SETTLE_ALL, [
                currentConfig.poolKey.currency1,
                currentConfig.amountIn,
            ])
            v4Planner.addAction(Actions.TAKE_ALL, [
                currentConfig.poolKey.currency0,
                currentConfig.amountOutMinimum,
            ])

            console.log('Amount in', currentConfig.amountIn)
            console.log('Amount out minimum', currentConfig.amountOutMinimum)
            routePlanner.addCommand(CommandType.V4_SWAP, [v4Planner.actions, v4Planner.params])

            const encodedActions = v4Planner.finalize()

            const estimatedGas = await this.universalRouterContract[
                'execute(bytes,bytes[],uint256)'
            ].estimateGas(routePlanner.commands, [encodedActions], this.deadline)
            const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.2))

            const txOptions: any = {
                gasLimit: gasLimit,
            }

            console.log('execute Swap')

            const tx = await this.universalRouterContract.execute(
                routePlanner.commands,
                [encodedActions],
                this.deadline,
                txOptions
            )

            const receipt = await tx.wait()

            return receipt
        } catch (error) {
            console.error('Error executing swap:', error)
            throw error
        }
    }

    async approveToken(amountIn: string) {
        const tokenContract = new Contract(TOKEN_INFO.address, TOKEN_ABI, this.signer)
        const permit2Contract = new ethers.Contract(
            PERMIT2_ADDRESS,
            PERMIT2_ABI,
            this.signer
        )

        const isTokenAllowanceApproved = await this.checkTokenAllowance()
        if (!isTokenAllowanceApproved) {
            const tx1 = await tokenContract.approve(PERMIT2_ADDRESS, ethers.MaxUint256)
        }

        const isPermit2Allowance = await this.checkPermit2Allowance(amountIn)
        if (!isPermit2Allowance) {
            const MAX_UINT160 = (1n << 160n) - 1n
            const expiration = (1n << 48n) - 1n; // BigInt cho max uint48
            const tx2 = await permit2Contract.approve(
                TOKEN_INFO.address,
                this.universalRouterContract.getAddress(),
                MAX_UINT160,
                expiration
            )
        }
    }

    async checkTokenAllowance() {
        const tokenContract = new Contract(TOKEN_INFO.address, TOKEN_ABI, this.signer)

        const currentAllowance = await tokenContract.allowance(
            await this.signer.getAddress(),
            PERMIT2_ADDRESS
        )
        if (currentAllowance > 0n) {
            return true;
        } else {
            return false;
        }
    }

    async checkPermit2Allowance(amountIn: string) {
        const permit2Contract = new ethers.Contract(
            PERMIT2_ADDRESS,
            PERMIT2_ABI,
            this.signer
        )

        const allowance = await permit2Contract.allowance(
            await this.signer.getAddress(),
            TOKEN_INFO.address,
            this.universalRouterContract.getAddress()
        )

        const now = Math.floor(Date.now() / 1000)
        const amountInParsed = parseUnits(amountIn, TOKEN_INFO.decimals); // BigInt

        const isValid =
            allowance.amount >= amountInParsed &&
            (allowance.expiration === 0 || allowance.expiration > now)

        // console.log("Permit2 allowance:", allowance)
        // console.log("Allowance valid?", isValid)

        return isValid;
    }
}

export const createUniversalRouterContract = async (
    walletProvider: any,
    hooks: string
): Promise<UniversalRouterContract> => {
    const universalRouterContract = new UniversalRouterContract(walletProvider, hooks)
    await universalRouterContract.initialize()
    return universalRouterContract
}
