module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: 'v4.0-latest',
      skipMD5: true
    },
    autoStart: false
  }
};
