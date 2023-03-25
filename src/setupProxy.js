const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://10.28.179.229:18080',
      changeOrigin: true,
      pathRewrite: {'^/api': '' }
    })
  );
};