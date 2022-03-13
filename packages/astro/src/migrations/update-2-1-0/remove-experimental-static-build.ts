import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';

export default async function (tree: Tree) {
  const executorsToMigrate = [
    '@nxtensions/astro:build',
    '@nxtensions/astro:dev',
  ];

  for (const [projectName, project] of getProjects(tree)) {
    updateAstroConfiguration(tree, project);

    for (const [, target] of Object.entries(project.targets ?? {})) {
      if (!executorsToMigrate.includes(target.executor)) {
        continue;
      }

      if (target.options) {
        updateOptions(target.options);
      }

      if (!target.configurations) {
        continue;
      }
      Object.entries(target.configurations).forEach(([, options]) => {
        updateOptions(options);
      });
    }

    updateProjectConfiguration(tree, projectName, project);
  }

  await formatFiles(tree);
}

function updateAstroConfiguration(
  tree: Tree,
  project: ProjectConfiguration
): void {
  const configNames = [
    'astro.config.mjs',
    'astro.config.js',
    'astro.config.cjs',
    'astro.config.ts',
  ];

  for (const configName of configNames) {
    const configPath = `${project.root}/${configName}`;
    if (!tree.exists(configPath)) {
      continue;
    }

    const astroConfig = tree.read(configPath, 'utf-8');
    const astroConfigAst = tsquery.ast(astroConfig);
    const experimentalStaticBuildAssignmentSelector =
      'PropertyAssignment:has(Identifier[name="buildOptions"]) PropertyAssignment:has(Identifier[name="experimentalStaticBuild"])';
    const [experimentalStaticBuildAssignment] = tsquery(
      astroConfigAst,
      experimentalStaticBuildAssignmentSelector,
      { visitAllChildren: true }
    );

    if (experimentalStaticBuildAssignment) {
      const [falseKeyword] = tsquery(
        experimentalStaticBuildAssignment,
        'Identifier ~ FalseKeyword',
        { visitAllChildren: true }
      );

      const experimentalStaticBuildAssignmentEnd =
        experimentalStaticBuildAssignment.getEnd();
      const updatedConfig =
        astroConfig.slice(0, experimentalStaticBuildAssignment.getStart()) +
        (falseKeyword ? 'legacyBuild: true' : '') +
        astroConfig.slice(
          falseKeyword
            ? experimentalStaticBuildAssignmentEnd
            : experimentalStaticBuildAssignmentEnd + 1
        );

      tree.write(configPath, updatedConfig);
    }

    return;
  }
}

function updateOptions(options: {
  experimentalStaticBuild?: boolean;
  legacyBuild?: boolean;
}): void {
  if (options.experimentalStaticBuild === false) {
    options.legacyBuild = true;
  }
  delete options.experimentalStaticBuild;
}
