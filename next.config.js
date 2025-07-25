/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: "build",
  images: {
    unoptimized: true,
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
  webpack: (config) => {
    // 强制所有 .ts/.tsx 文件走 Babel 编译
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    });

    return config;
  },
};
