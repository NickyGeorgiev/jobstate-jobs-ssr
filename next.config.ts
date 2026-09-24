import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Без оптимизация през sharp: build-ът от Windows би включил Windows версия
    // на sharp, която не работи на Linux хостинга. Логата се зареждат директно
    // от Supabase Storage.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;