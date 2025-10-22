// components/CatHomeIcon.js

const CustomHomeIcon = ({
	className,
	...props
}: {
	className?: string
	props?: React.SVGProps<SVGSVGElement>
}) => {
	return (
		<svg
			className={className}
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='1.5'
			strokeLinecap='round'
			strokeLinejoin='round'
			xmlns='http://www.w3.org/2000/svg'
			{...props}>
			<path d='M2 10.5L12 3l5.29 4.07a1 1 0 0 1 .21 1.42L15 12' />
			<path d='M22 10.5L12 3l-5.29 4.07a1 1 0 0 0-.21 1.42L9 12' />
			<path d='M4 11.5V21h16V11.5' />
			<path d='M9 21V15a3 3 0 0 1 6 0v6' />
			<path d='M3 14l-2-1' />
			<path d='M3 17l-2-1' />
			<path d='M21 14l2-1' />
			<path d='M21 17l2-1' />
		</svg>
	)
}

export default CustomHomeIcon
