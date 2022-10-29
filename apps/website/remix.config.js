/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  ignoredRouteFiles: ['**/.*'],
  watchPaths: ['../../libs/react-ui/*'],
  serverDependenciesToBundle: ['axios', '@codemirror/legacy-modes'],
};
