/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
  	basePath: process.env.BASE_PATH ? process.env.BASE_PATH : "",
	reactStrictMode: false,
};

export default nextConfig;
