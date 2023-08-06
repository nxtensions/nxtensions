import type { GeneratorCallback, Tree } from '@nx/devkit';
import { addDependenciesToPackageJson } from '../../../utilities/package-json';
import type { IntegrationInfo } from '../schema';

export function addIntegrationsPackages(
  tree: Tree,
  integrations: IntegrationInfo[]
): GeneratorCallback {
  if (integrations.length === 0) {
    return undefined;
  }

  const dependencies = Array.from(
    new Set(
      integrations
        .map(({ dependencies }) => dependencies)
        .flat(1)
        .sort(([a], [b]) => a.localeCompare(b))
    )
  );

  return addDependenciesToPackageJson(
    tree,
    {},
    dependencies.reduce((acc, [packageName, version]) => {
      acc[packageName] = version;
      return acc;
    }, {})
  );
}
