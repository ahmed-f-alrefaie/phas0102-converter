/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
    async rewrites() {
    return [
      {
        source: '/backend/:slug*',
        destination: 'http://localhost:8000/:slug*'
      },
    ]},
};

module.exports = nextConfig;
