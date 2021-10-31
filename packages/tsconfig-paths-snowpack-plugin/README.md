# @nxtensions/tsconfig-paths-snowpack-plugin

[Snowpack](https://www.snowpack.dev/) plugin adding support for using path mappings specified in tsconfig files. This is useful for projects that use Typescript and want to reuse the defined path mappings in the tsconfig as [aliases](https://www.snowpack.dev/reference/configuration#alias) in Snowpack.

## How to use

Add the plugin to your Snowpack configuration:

```javascript
// snowpack.config.mjs

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: ['@nxtensions/tsconfig-paths-snowpack-plugin'],
};
```

By default the plugin will try to locate a `tsconfig.json` file relative to the Snowpack root. A custom configuration file path can be specified by specifying the `tsConfig` option:

```javascript
// snowpack.config.mjs

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  plugins: [
    [
      '@nxtensions/tsconfig-paths-snowpack-plugin',
      { tsConfig: 'tsconfig.app.json' },
    ],
  ],
};
```
