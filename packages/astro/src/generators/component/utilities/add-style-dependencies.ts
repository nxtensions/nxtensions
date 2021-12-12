import {
  Tree,
  GeneratorCallback,
  addDependenciesToPackageJson,
} from '@nrwl/devkit';
import { NormalizedGeneratorOptions } from '../schema';

export function addStyleDependencies(
  tree: Tree,
  options: NormalizedGeneratorOptions
): GeneratorCallback {
  const styleDependencies = {
    scss: { sass: '^1.44.0' },
    sass: { sass: '^1.44.0' },
    less: { less: '^4.1.2' },
    styl: { stylus: '^0.55.0' },
  };

  if (options.style in styleDependencies) {
    return addDependenciesToPackageJson(
      tree,
      {},
      styleDependencies[options.style]
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return () => {};
}
