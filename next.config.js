/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config, { webpack, isServer, nextRuntime }) => {

    /**
     * Avoid AWS SDK Node.js require issue:
     * Error Critical dependency: the request of a dependency is an expression
     *
     * @see https://github.com/aws-amplify/amplify-js/issues/11030#issuecomment-1598207365
     */
    if (isServer && nextRuntime === 'nodejs')
      config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /^aws-crt$/ }));
    return config;
  },
};

module.exports = nextConfig;
