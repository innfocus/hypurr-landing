'use client'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { NFTData } from '../app/api/nft/holding/route'
import { shortenEthAddress, shortenEthBalance } from '../utils/utils'
import { SoldNFT } from '../app/api/nft/sold/route'

export type NftInfo = {
	id: string
	price: string
	image: string
}

type NftInfoModalProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	nft: NFTData | SoldNFT | null
}

export function NftInfoModal({ open, onOpenChange, nft }: NftInfoModalProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side='bottom'
				className='w-full md:h-[50vh] h-[80vh] rounded-t-xl p-0 flex flex-col'>
				<SheetHeader>
					<SheetTitle className='text-center'>
						{nft ? `${nft.name}` : 'NFT Details'}
					</SheetTitle>
					<SheetDescription className='text-center'>
						Collection: CloneX — Swipe down or tap outside to close
					</SheetDescription>
				</SheetHeader>

				<div className='flex-1 overflow-y-auto px-4'>
					<div className='mx-auto w-full md:max-w-4xl lg:max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='md:col-span-1 flex justify-center'>
							<div className='w-40 h-40 rounded-lg overflow-hidden border border-border'>
								<img
									src={nft?.image || '/placeholder.svg'}
									alt={`CloneX ${nft?.tokenId || ''}`}
									className='w-full h-full object-cover'
								/>
							</div>
						</div>

						<div className='md:col-span-2 space-y-4'>
							{/* Type */}
							{/* <div>
								<div className='text-sm font-semibold mb-1'>Type</div>
								<div className='p-3 rounded-md bg-primary/5 border border-border flex items-center justify-between'>
									<span>Male</span>
									<Badge variant='secondary'>6039 total</Badge>
								</div>
							</div> */}

							{/* Attributes */}
							<div>
								<div className='text-sm font-semibold mb-1'>
									Attributes ({nft?.attributes?.length})
								</div>
								{nft?.attributes &&
									nft?.attributes.map((attribute) => (
										<div className='space-y-2'>
											<div className='p-3 rounded-md bg-primary/5 border border-border flex items-center justify-between'>
												<span>
													{attribute.trait_type || attribute.traitType}
												</span>
												<Badge>{attribute.value}</Badge>
											</div>
										</div>
									))}
							</div>

							{/* Rarity Stats */}
							{/* <div>
								<div className='text-sm font-semibold mb-1'>Rarity Stats</div>
								<div className='p-3 rounded-md bg-primary/5 border border-border'>
									<div className='grid grid-cols-3 gap-2 text-sm'>
										<div>
											<div className='text-muted-foreground'>
												Rarity Rank:
											</div>
											<div className='font-medium'>#3560</div>
										</div>
										<div>
											<div className='text-muted-foreground'>
												Attribute Count:
											</div>
											<div className='font-medium'>2</div>
										</div>
										<div>
											<div className='text-muted-foreground'>Type:</div>
											<div className='font-medium'>Male</div>
										</div>
									</div>
								</div>
							</div> */}

							{/* Current Listing - Only show for held NFTs */}
							{nft && 'owner' in nft && (
								<div>
									<div className='text-sm font-semibold mb-1'>
										Current Listing
									</div>
									<div className='p-3 rounded-md bg-primary/5 border border-border space-y-2 text-sm'>
										<div className='flex justify-between'>
											<span>Status:</span>
											<Badge variant='secondary'>For Sale</Badge>
										</div>
										<div className='flex justify-between'>
											<span>Price:</span>
											<span className='font-bold text-pink-500'>
												{(nft as NFTData)?.lastSalePrice} ETH
											</span>
										</div>
										<div className='flex justify-between'>
											<span>Owner:</span>
											<span>
												{shortenEthAddress((nft as NFTData)?.owner ?? '')}
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Sales History - Only show for sold NFTs */}
							{nft && 'soldPrice' in nft && (
								<div>
									<div className='text-sm font-semibold mb-4'>Sales History</div>
									<div className='space-y-3'>
										{/* Sale Transaction */}
										<div className='bg-card-primary/50 border border-border rounded-lg p-4'>
											<div className='flex justify-between items-start'>
												{/* Left Section - Amount and From Address */}
												<div className='flex-1'>
													<div className='text-2xl font-bold text-foreground mb-2'>
														{shortenEthBalance(
															(nft as SoldNFT)?.soldPrice ?? '0'
														)}{' '}
														ETH
													</div>
													<div className='text-sm text-muted-foreground'>
														From:{' '}
														{shortenEthAddress(
															(nft as SoldNFT)?.buyer ?? ''
														)}
													</div>
												</div>

												{/* Right Section - Date and To Address */}
												<div className='text-right'>
													<div className='text-sm text-muted-foreground mb-1'>
														{new Date().toLocaleDateString('en-US', {
															month: 'numeric',
															day: 'numeric',
															year: 'numeric',
														})}
													</div>
													<div className='text-sm text-muted-foreground'>
														To:{' '}
														{shortenEthAddress(
															process.env.NEXT_PUBLIC_OWNER_ADDRESS ??
																''
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<Separator className='my-4 mx-4' />

				<div className='flex justify-end px-4 pb-4'>
					<Button
						className='bg-primary text-primary-foreground'
						onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	)
}
