/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: "build",
  images: {
    unoptimized: true,
  },
  experimental: {
    //largePageDataBytes: 128 * 1000, // 128KB by default
    largePageDataBytes: 128 * 100000,
  },
  compiler: {
    styledComponents: true, // 如果你使用了 styled-components
  },
  typescript: {
    ignoreBuildErrors: false, // 确保类型检查
  },
};
