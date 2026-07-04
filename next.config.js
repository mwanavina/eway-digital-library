// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm69autqsig.ufs.sh',
        pathname: '/f/**',
      },
    ],
  },
  allowedDevOrigins: ['10.216.1.191'],
};

module.exports = nextConfig;