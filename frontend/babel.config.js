module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env', 'babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }],
      // ["@babel/plugin-proposal-class-properties", { "loose": true }],
      // ["@babel/plugin-proposal-private-methods", { "loose": true }],
      // ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
    ]
  };
};
