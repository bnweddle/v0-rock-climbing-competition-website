/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site to ./out — deployed to Cloudflare Workers static assets.
  // Safe here because every page is client-rendered (zustand + localStorage);
  // there are no route handlers, server actions, or dynamic segments.
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
