/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@skybooking/ui",
    "@skybooking/hooks",
    "@skybooking/puck-config",
    "@skybooking/api-client",
  ],
};
module.exports = nextConfig;
