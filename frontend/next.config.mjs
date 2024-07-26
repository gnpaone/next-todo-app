/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
  	basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
	reactStrictMode: false,
};

export default nextConfig;
