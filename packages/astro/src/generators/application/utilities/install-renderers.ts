import {
  addDependenciesToPackageJson,
  GeneratorCallback,
  Tree,
} from '@nrwl/devkit';
import { Renderer } from '../schema';

export function installRenderers(
  tree: Tree,
  renderers: Renderer[]
): GeneratorCallback {
  if (renderers.length === 0) {
    return undefined;
  }

  return addDependenciesToPackageJson(
    tree,
    {},
    renderers.reduce((acc, renderer) => {
      acc[renderer] = 'latest';
      return acc;
    }, {})
  );
}
