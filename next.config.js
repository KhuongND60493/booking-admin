const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const REMOTE_VERSION = require('./package.json').version;

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  ...(phase === PHASE_PRODUCTION_BUILD ? { output: 'export' } : {}),
  reactStrictMode: true,

  webpack(config, options) {
    const { isServer } = options;
    if (isServer) {
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
          './BookingListPage': './components/pages/BookingListPage.tsx',
          './WaitlistPage': './components/pages/WaitlistPage.tsx',
          './LayoutEditorPage': './components/pages/LayoutEditorPage.tsx',
        },
        shared: {
          react: { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
        },
      })
    );

    return config;
  },

  env: {
    REMOTE_VERSION,
  },
});
