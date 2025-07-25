/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  distDir: "build",
  images: {
    unoptimized: true,
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  compiler: {
    styledComponents: true, // 如果使用了 styled-components
  },
  typescript: {
    ignoreBuildErrors: false, // 确保类型检查
  },
};
