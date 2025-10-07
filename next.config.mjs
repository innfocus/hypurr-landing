/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	webpack: (config) => {
		// chặn không cho Next cố resolve 'pino-pretty'
		config.resolve.fallback = {
			...config.resolve.fallback,
			'pino-pretty': false,
		}

		// alias pino sang bản browser để tránh lỗi trong frontend
		config.resolve.alias = {
			...config.resolve.alias,
			pino: 'pino/browser',
			// Map ethers v5 deep imports used by some SDKs to ethers v6
			'ethers/lib/utils': 'ethers',
			'ethers/lib/ethers': 'ethers',
		}

		return config
	},
}

export default nextConfig
