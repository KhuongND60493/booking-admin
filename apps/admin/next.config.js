const { PHASE_PRODUCTION_BUILD } = require('next/constants');
const REMOTE_VERSION = require('./package.json').version;

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  ...(phase === PHASE_PRODUCTION_BUILD ? { output: 'export' } : {}),
  reactStrictMode: true,

  // CORS cho dev server — resto (localhost:3000) fetch registry.json + load remoteEntry.js
  // từ booking-admin (localhost:3001) là cross-origin. Không áp dụng khi build production
  // (output: 'export') vì Next không hỗ trợ headers() với static export.
  ...(phase !== PHASE_PRODUCTION_BUILD
      ? {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
            },
          ];
        },
      }
      : {}),

  webpack(config, options) {
    const { isServer, dev } = options;
    if (isServer) {
      return config;
    }

    // Dev mặc định KHÔNG add ModuleFederationPlugin — nó cần đổi output.chunkLoadingGlobal
    // sang tên riêng ('webpackChunk_bookingAdmin') để remote không đụng global chunk-loading
    // với host khi bị nhúng (2 app Next.js dùng chung tên mặc định webpackChunk_N_E), nhưng
    // đổi chunkLoadingGlobal lại phá Fast Refresh của chính booking-admin lúc dev (dev-client
    // của Next lắng nghe HMR update qua đúng global mặc định, bị đổi tên là mất hot reload).
    // Muốn test kịch bản nhúng vào host lúc dev: FEDERATION_DEV=true pnpm dev (đánh đổi mất
    // Fast Refresh trong phiên dev đó).
    if (dev && process.env.FEDERATION_DEV !== 'true') {
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
            react: { singleton: true, requiredVersion: false, eager: false },
            'react-dom': { singleton: true, requiredVersion: false, eager: false },
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
