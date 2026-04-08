/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: 'https',
        hostname: 'hhzgiojxapatpxjvlunm.supabase.co', // 🌟 Your exact Supabase domain
        port: '',
        pathname: '/storage/v1/object/public/**', // 🌟 Allows all public bucket images
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // 🌟 Increases limit to 10MB to allow 4 images
    },
  },
};

export default nextConfig;
