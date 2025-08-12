/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  reactStrictMode: true,
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
  webpack: (config, { isServer }) => {
    // 确保 TypeScript 文件被正确处理
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: "ts-loader",
      options: { transpileOnly: true },
    });
    return config;
  },
};
