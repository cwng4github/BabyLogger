/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  //output: 'standalone',
  output: 'export',
  // Optional: Add trailing slashes to keep pretty URLs (e.g., /about/ instead of /about.html)
  trailingSlash: true,
  basePath: isProd ? '/BabyLogger' : '',
  distDir: 'docs', // 👈 Overrides the default 'out' directory to 'docs'  
}

module.exports = nextConfig

// Made with Bob
