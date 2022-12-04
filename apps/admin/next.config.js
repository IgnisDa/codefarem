const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['@codefarem/main-db']);

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

module.exports = withPlugins([[withTM]], config);
