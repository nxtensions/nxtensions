import { join, relative, resolve } from 'path';
import type { SnowpackConfig, SnowpackPlugin } from 'snowpack';
import * as ts from 'typescript';

export interface PluginOptions {
  tsConfig?: string;
}

const pluginName = 'tsconfig-paths-snowpack-plugin';

export default function (
  initialSnowpackConfig: SnowpackConfig,
  pluginOptions: PluginOptions
): SnowpackPlugin {
  const tsConfigPath = join(
    initialSnowpackConfig.root,
    pluginOptions.tsConfig || 'tsconfig.json'
  );
  const tsConfigReadResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const { options: compilerOptions } = ts.parseJsonConfigFileContent(
    tsConfigReadResult.config,
    ts.sys,
    initialSnowpackConfig.root
  );

  return {
    name: pluginName,
    config(snowpackConfig: SnowpackConfig): void {
      if (
        !compilerOptions.paths ||
        Object.keys(compilerOptions.paths).length === 0
      ) {
        return;
      }

      if (!compilerOptions.baseUrl) {
        throw new Error(
          `[${pluginName}] The "baseUrl" must be specified in the tsconfig when "paths" are provided.`
        );
      }

      const offsetFromRoot = relative(
        initialSnowpackConfig.root,
        compilerOptions.baseUrl
      );

      const aliasesFromTsConfigPaths: { [key: string]: string } = {};
      Object.entries(compilerOptions.paths).forEach(([path, [mapping]]) => {
        aliasesFromTsConfigPaths[replaceTrailingWildcard(path)] = resolve(
          snowpackConfig.root,
          offsetFromRoot,
          replaceTrailingWildcard(mapping)
        );
      });

      snowpackConfig.alias = {
        ...aliasesFromTsConfigPaths,
        ...snowpackConfig.alias,
      };
    },
  };
}

function replaceTrailingWildcard(path: string) {
  return path.endsWith('/*') ? path.slice(0, -2) : path;
}
