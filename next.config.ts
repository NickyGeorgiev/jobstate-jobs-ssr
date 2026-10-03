import type { NextConfig } from "next";

// true  = сайтът е качен, но Google е помолен да НЕ го индексира (тестов период).
// false = публично пускане (индексиране разрешено).
// Преди истинското пускане смени на false, направи билд и качи наново.
const PRE_LAUNCH = true;

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    if (!PRE_LAUNCH) return [];
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
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
