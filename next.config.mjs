/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
	cleanDistDir: true,
	compress: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
	compiler: isProdEnv ? {
		reactRemoveProperties: true,
		removeConsole: { exclude: ["error", "warn"] }
	} : undefined
};

export default nextConfig;