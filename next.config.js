/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jyaanbez3nt6az85.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
};
 
module.exports = nextConfig;