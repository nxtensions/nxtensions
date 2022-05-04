import { ProjectConfiguration, Workspaces } from '@nrwl/devkit';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import standardVersion from 'standard-version';
import { execSyncOrDryRun } from './utils';

export interface ReleaseProjectOptions {
  dryRun: boolean;
  version: string | undefined;
}

export async function releaseProject(
  projectName: string,
  options: ReleaseProjectOptions & { localRelease: boolean }
): Promise<void> {
  const workspace = new Workspaces(
    join(__dirname, '../..')
  ).readWorkspaceConfiguration();

  const project = workspace.projects[projectName];
  const { localRelease, ...rest } = options;

  if (options.localRelease) {
    await releaseLocally(projectName, project, {
      ...rest,
      version: options.version ?? '99.99.99',
    });
  } else {
    await releaseToNpm(projectName, project, rest);
  }

  if (options.dryRun) {
    console.log(
      `\n[DRY RUN]: No changes were made to the project "${projectName}".\n`
    );
  }
}

async function releaseLocally(
  projectName: string,
  project: ProjectConfiguration,
  options: ReleaseProjectOptions
): Promise<void> {
  assertLocalRegistry();

  execSyncOrDryRun(
    `npx nx build ${projectName}`,
    { stdio: 'inherit' },
    options.dryRun
  );

  const outputPath = project.targets?.build?.options?.outputPath;
  const packageJsonPath = !options.dryRun
    ? join(outputPath, 'package.json')
    : join(project.root, 'package.json');

  if (!existsSync(packageJsonPath)) {
    throw new Error(`Could not find package.json in ${packageJsonPath}`);
  }

  await standardVersion({
    bumpFiles: [packageJsonPath],
    packageFiles: [packageJsonPath],
    skip: {
      changelog: true,
      commit: true,
      tag: true,
    },
    releaseAs: options.version,
    dryRun: options.dryRun,
  });

  execSyncOrDryRun(
    `npm publish ${outputPath}`,
    { stdio: 'inherit' },
    options.dryRun
  );
}

async function releaseToNpm(
  projectName: string,
  project: ProjectConfiguration,
  options: ReleaseProjectOptions
): Promise<void> {
  const packageJsonPath = join(project.root, 'package.json');

  const standardVersionOptions: standardVersion.Options & { verify: boolean } =
    {
      path: project.root,
      bumpFiles: [packageJsonPath],
      packageFiles: [packageJsonPath],
      infile: `${project.root}/CHANGELOG.md`,
      tagPrefix: `@nxtensions/${projectName}@v`,
      releaseCommitMessageFormat: `chore(release): @nxtensions/${projectName}@{{currentTag}}`,
      scripts: {
        postchangelog: 'npx nx format:write',
      },
      verify: false,
      dryRun: options.dryRun,
    };

  if (options.version) {
    standardVersionOptions.releaseAs = options.version;
  }

  await standardVersion(standardVersionOptions);

  execSyncOrDryRun(
    `npx nx build ${projectName}`,
    { stdio: 'inherit' },
    options.dryRun
  );

  const outputPath = project.targets?.build?.options?.outputPath;

  execSyncOrDryRun(
    `npm publish ${outputPath} --access=public`,
    { stdio: 'inherit', env: process.env },
    options.dryRun
  );

  execSyncOrDryRun(
    'git push --follow-tags origin main',
    { stdio: 'inherit' },
    options.dryRun
  );
}

function assertLocalRegistry() {
  const registry = execSync('npm config get registry', { encoding: 'utf8' });

  if (!registry.trim().startsWith('http://localhost')) {
    console.error(
      `The NPM registry must be set to a local registry. Current value: ${registry}`
    );
    process.exit(1);
  }
}

if (require.main === module) {
  const args = require('yargs/yargs')(process.argv.slice(2))
    .option('project', {
      describe: 'Project name',
      type: 'string',
      demandOption: true,
    })
    .option('local', {
      describe: 'Release locally',
      type: 'boolean',
      default: false,
    })
    .version(false)
    .option('version', {
      describe: 'Version to release',
      type: 'string',
    })
    .option('dryRun', {
      describe: 'Do not make any changes, but output the steps',
      type: 'boolean',
      default: false,
    })
    .help()
    .parse();

  releaseProject(args.project, {
    dryRun: args.dryRun,
    localRelease: args.local ?? false,
    version: args.version,
  });
}
