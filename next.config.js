/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  //output: 'standalone',
  output: 'export',
  // Optional: Add trailing slashes to keep pretty URLs (e.g., /about/ instead of /about.html)
  trailingSlash: true,
  distDir: 'docs', // 👈 Overrides the default 'out' directory to 'docs'  
}

module.exports = nextConfig

// Made with Bob
