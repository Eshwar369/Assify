const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Limit watchFolders strictly to mobile directory to prevent crawling parent .venv / delulu / data
config.watchFolders = [__dirname];

// Block crawling outside of mobile to eliminate Windows EMFILE file watcher exhaustion
config.resolver.blockList = [
  /.*[\/\\]\.venv[\/\\].*/,
  /.*[\/\\]delulu[\/\\].*/,
  /.*[\/\\]data[\/\\].*/,
  /.*[\/\\]\.git[\/\\].*/,
];

module.exports = config;
