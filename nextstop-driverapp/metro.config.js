// Metro configuration for Expo SDK 53
// Enable package exports to improve resolution of modern packages
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver = config.resolver || {};
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
