const { mergeConfig } = require("vite");

module.exports = (config) => {
  // Important: always return the modified config
  const allowedHosts = ['localhost','aleevia.cloud'];
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
   server: {
     allowedHosts: 'all'
   }
  });
};