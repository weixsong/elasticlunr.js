module.exports = {
  "presets": ["@babel/preset-env"],
  "plugins": ["babel-plugin-add-module-exports"],
  "env": {
    "test": {
      "plugins": ["istanbul"]
    }
  }
};