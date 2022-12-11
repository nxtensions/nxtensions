import type { Tree } from '@nrwl/devkit';
import { getWorkspaceLayout, joinPathFragments, names } from '@nrwl/devkit';
import fetch from 'node-fetch';
import type {
  GeneratorOptions,
  IntegrationInfo,
  NormalizedGeneratorOptions,
} from '../schema';

export async function normalizeOptions(
  tree: Tree,
  options: GeneratorOptions
): Promise<NormalizedGeneratorOptions> {
  const { appsDir, standaloneAsDefault } = getWorkspaceLayout(tree);

  const name = names(options.name).fileName;
  const directory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = directory.replace(/\//g, '-');
  const projectRoot = joinPathFragments(appsDir, directory);
  const tags = options.tags
    ? options.tags.split(',').map((tag) => tag.trim())
    : [];

  const integrations = await getIntegrations(options);

  return {
    ...options,
    addCypressTests: options.addCypressTests ?? true,
    projectName,
    projectRoot,
    integrations,
    standaloneConfig: options.standaloneConfig ?? standaloneAsDefault,
    tags,
  };
}

// Similar to process done by the create-astro package for compatibility
// https://github.com/withastro/astro/blob/9b530bdece4c96fcfa3d2a60c783718401c30535/packages/astro/src/core/add/index.ts#L90
async function getIntegrations(
  options: GeneratorOptions
): Promise<IntegrationInfo[]> {
  if (!options.integrations?.length) {
    return [];
  }

  // normalize some known, common aliases
  const packageAliases = new Map([
    ['solid', 'solid-js'],
    ['tailwindcss', 'tailwind'],
  ]);
  const integrations = options.integrations.map((name) =>
    packageAliases.has(name) ? packageAliases.get(name) : name
  );

  return await resolveIntegrations(integrations);
}

async function resolveIntegrations(
  integrationNames: string[]
): Promise<IntegrationInfo[]> {
  return await Promise.all(
    integrationNames.map(async (integration): Promise<IntegrationInfo> => {
      const parsed = parseIntegrationName(integration);
      if (!parsed) {
        throw new Error(
          `"${integration}" does not appear to be a valid package name!`
        );
      }

      let { scope = '' } = parsed;
      const { name, tag } = parsed;
      // Allow third-party integrations starting with `astro-` namespace
      if (!name.startsWith('astro-')) {
        scope = `astrojs`;
      }
      const packageName = `${scope ? `@${scope}/` : ''}${name}`;

      const result = await fetch(
        `https://registry.npmjs.org/${packageName}/${tag}`
      ).then((res) => {
        if (res.status === 404) {
          throw new Error(
            `Unable to fetch "${packageName}". Does this package exist?`
          );
        }
        return res.json();
      });

      const dependencies: IntegrationInfo['dependencies'] = [
        [result['name'], `^${result['version']}`],
      ];

      if (result['peerDependencies']) {
        for (const peer in result['peerDependencies']) {
          dependencies.push([peer, result['peerDependencies'][peer]]);
        }
      }

      return {
        name: integration.split('-')[0],
        packageName: packageName,
        dependencies,
      };
    })
  );
}

function parseIntegrationName(spec: string) {
  const result = parseNpmName(spec);
  if (!result) {
    return;
  }

  const { scope } = result;
  let { name } = result;
  let tag = 'latest';
  if (scope) {
    name = name.replace(scope + '/', '');
  }
  if (name.includes('@')) {
    const tagged = name.split('@');
    name = tagged[0];
    tag = tagged[1];
  }
  return { scope, name, tag };
}

export function parseNpmName(
  spec: string
): { scope?: string; name: string; subpath?: string } | undefined {
  // not an npm package
  if (!spec || spec[0] === '.' || spec[0] === '/') {
    return undefined;
  }

  let scope: string | undefined;
  let name = '';

  const parts = spec.split('/');
  if (parts[0][0] === '@') {
    scope = parts[0];
    name = parts.shift() + '/';
  }
  name += parts.shift();

  const subpath = parts.length ? `./${parts.join('/')}` : undefined;

  return {
    scope,
    name,
    subpath,
  };
}
