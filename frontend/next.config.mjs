/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9090',
        pathname: '/**', // Matches all paths on this host
      },
    ],
  },
};

export default nextConfig;