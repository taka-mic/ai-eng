const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

const WEB_STUBS = {
  'react-native-gesture-handler': path.resolve(__dirname, 'web-stubs/react-native-gesture-handler.js'),
  'react-native-reanimated': path.resolve(__dirname, 'web-stubs/react-native-reanimated.js'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && WEB_STUBS[moduleName]) {
    return { type: 'sourceFile', filePath: WEB_STUBS[moduleName] };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
