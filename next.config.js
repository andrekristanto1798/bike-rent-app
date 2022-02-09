const config = {
  webpack5: true,
  experimental: {
    esmExternals: false,
  },
};

// eslint-disable-next-line import/no-extraneous-dependencies
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

module.exports = config;
