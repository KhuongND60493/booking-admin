const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const REMOTE_VERSION = require('./package.json').version;

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  ...(phase === PHASE_PRODUCTION_BUILD ? { output: 'export' } : {}),
  reactStrictMode: true,

  webpack(config, options) {
    const { isServer, dev } = options;
    if (isServer) {
      return config;
    }
    if (dev) {
      return config;
    }

    const { ModuleFederationPlugin } = options.webpack.container;
    config.output.publicPath = 'auto';
    config.output.uniqueName = 'bookingAdmin';
    config.output.chunkLoadingGlobal = 'webpackChunk_bookingAdmin';
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = false;

    config.plugins.push(
      new ModuleFederationPlugin({
        name: 'bookingAdmin',
        filename: `static/chunks/remoteEntry.${REMOTE_VERSION}.js`,
        exposes: {
          './BookingListPage': './containers/bookings/index.tsx',
          './WaitlistPage': './containers/waitlist/index.tsx',
          './LayoutEditorPage': './containers/layout/index.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
        },
      })
    );

    return config;
  },
  transpilePackages: [
    "@skybooking/ui",
    "@skybooking/hooks",
    "@skybooking/puck-config",
    "@skybooking/api-client",
  ],
  env: {
    REMOTE_VERSION,
  },
});
