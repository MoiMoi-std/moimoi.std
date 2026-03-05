/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Cloudinary
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        // Supabase Storage
        protocol: 'https',
        hostname: '**.supabase.co'
      },
      {
        // Supabase Storage (alternative domain)
        protocol: 'https',
        hostname: '**.supabase.in'
      },
      {
        // Unsplash (ảnh placeholder/demo)
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
}

module.exports = nextConfig
