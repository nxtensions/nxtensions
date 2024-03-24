import {
  addDependenciesToPackageJson as _addDependenciesToPackageJson,
  readJson,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';

export function addDependenciesToPackageJson(
  tree: Tree,
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
): GeneratorCallback {
  const packageJson = readJson(tree, 'package.json');

  const filterOutExistingDependencies = (
    dependencies: Record<string, string>
  ) =>
    Object.entries(dependencies).reduce((acc, [name, version]) => {
      if (
        !packageJson.dependencies?.[name] &&
        !packageJson.devDependencies?.[name]
      ) {
        acc[name] = version;
      }

      return acc;
    }, {} as Record<string, string>);

  const filteredDependencies = filterOutExistingDependencies(dependencies);
  const filteredDevDependencies =
    filterOutExistingDependencies(devDependencies);

  return _addDependenciesToPackageJson(
    tree,
    filteredDependencies,
    filteredDevDependencies
  );
}
