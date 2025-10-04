import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typedRoutes: true, // Now stable!
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.jacobc.co.za',
        port: '',
      },
    ],
  },
};

export default nextConfig;
