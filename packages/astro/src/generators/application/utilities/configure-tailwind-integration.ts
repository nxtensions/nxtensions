import { joinPathFragments, readJson, type Tree } from '@nx/devkit';
import { insertImport } from '@nx/js';
import { ast, query } from '@phenomnomnominal/tsquery';
import { clean, coerce, lt } from 'semver';
import type { CallExpression } from 'typescript';
import type { IntegrationInfo, NormalizedGeneratorOptions } from '../schema';

export function configureTailwindIntegration(
  tree: Tree,
  options: NormalizedGeneratorOptions
): void {
  const tailwindIntegration = options.integrations.find(
    (integration) => integration.name === 'tailwind'
  );
  if (!tailwindIntegration) {
    return;
  }

  const tailwindIntegrationVersion = getTailwindIntegrationVersion(
    tree,
    tailwindIntegration
  );
  if (lt(tailwindIntegrationVersion, '4.0.0')) {
    return;
  }

  const astroConfigPath = joinPathFragments(
    options.projectRoot,
    'astro.config.mjs'
  );
  const astroConfigContent = tree.read(astroConfigPath, 'utf-8');
  let source = ast(astroConfigContent);

  const tailwindCallExpressions = query<CallExpression>(
    source,
    'ExportAssignment CallExpression:has(Identifier[name=defineConfig]) ObjectLiteralExpression PropertyAssignment:has(Identifier[name=integrations]) ArrayLiteralExpression CallExpression:has(Identifier[name=tailwind])'
  );
  if (!tailwindCallExpressions.length) {
    return;
  }

  const index = tailwindCallExpressions[0].getEnd() - 1;
  const updatedConfig =
    astroConfigContent.slice(0, index) +
    `{
      configFile: fileURLToPath(
        new URL('./tailwind.config.cjs', import.meta.url)
      ),
    }` +
    astroConfigContent.slice(index);

  tree.write(astroConfigPath, updatedConfig);

  // add import for `fileURLToPath`
  source = ast(updatedConfig);
  insertImport(tree, source, astroConfigPath, 'fileURLToPath', 'node:url');
}

function getTailwindIntegrationVersion(
  tree: Tree,
  integration: IntegrationInfo
): string | null {
  const { dependencies, devDependencies } = readJson(tree, 'package.json');
  const installedTailwindVersion =
    dependencies?.[integration.packageName] ??
    devDependencies?.[integration.packageName];

  if (installedTailwindVersion) {
    return cleanSemver(installedTailwindVersion);
  }

  const [, integrationVersion] = integration.dependencies.find(
    ([name]) => name === integration.packageName
  );

  return cleanSemver(integrationVersion);
}

function cleanSemver(version: string): string {
  return clean(version) ?? coerce(version).version;
}
