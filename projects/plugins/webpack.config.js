const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['shared']);

module.exports = {
  output: {
    uniqueName: "plugins",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      // library: { type: "var", name: "BasePlugin" },
      library: {type: "module"},
        // library: { type: "any" },
      // filename: 'BasePluginRemoteEntry.js',
      // exposes: {
      //   './MapComponent': './projects/plugins/src/app/base/map/map.component.ts',
      //   },
        // For remotes (please adjust)
        name: "BasePlugin",
        filename: "BasePluginRemoteEntry.js",
        exposes: {
          './MapComponent': './projects/plugins/src/app/base/map/map.component.ts',
          // './Module': './projects/plugins/src/app/base/base.module.ts',
        },

        // For hosts (please adjust)
        // remotes: {
        //     "plugins": "http://localhost:4200/remoteEntry.js",

        // },

        shared: share({
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto'},
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto'  },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@arcgis/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          // "shared": {
          //   singleton: true, strictVersion: true, eager: true,
          //   import: path.join(__dirname, '../../tsconfig.json')
          // },

          ...sharedMappings.getDescriptors()
        })

    }),
    sharedMappings.getPlugin()
  ],
};
