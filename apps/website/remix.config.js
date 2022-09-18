const { dirname, join } = require('node:path');

const outputPath = join(dirname(dirname(__dirname)), 'dist', 'apps', 'website');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  assetsBuildDirectory: IS_PRODUCTION
    ? `${outputPath}/public/build`
    : undefined,
  ignoredRouteFiles: ['**/.*'],
  serverBuildPath: IS_PRODUCTION ? `${outputPath}/index.js` : undefined,
  watchPaths: ['../../libs'],
};
