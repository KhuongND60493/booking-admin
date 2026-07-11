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
          './TimeSlotsPage': './containers/time-slots/index.tsx',
          './TablesPage': './containers/tables/index.tsx',
          './LayoutEditorPage': './containers/layout/index.tsx',
          './SettingsPage': './containers/settings/index.tsx',
          './BookingNewPage': './containers/bookings/new.tsx',
        },
        shared: {
          // eager: true để app chạy được standalone (Vercel) — Next.js không có async
          // boundary tự nhiên trước khi main-app runtime require react/react-dom, nếu
          // không eager sẽ ném "Shared module is not available for eager consumption".
          // Khi nhúng qua host, host đã init share scope (webpack-remote-loader.js) trước
          // khi container.get() chạy nên vẫn dùng lại đúng bản react của host (singleton).
          react: { singleton: true, requiredVersion: false, eager: true },
          'react-dom': { singleton: true, requiredVersion: false, eager: true },
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
