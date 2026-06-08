/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@passbyte/handels", "@passbyte/shared"],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
