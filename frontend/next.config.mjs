/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'networq-n0fq.onrender.com',
        pathname: '/**', // Matches all images from this host
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9090',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;