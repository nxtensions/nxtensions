import {
  createProjectGraphAsync,
  formatFiles,
  getProjects,
  readNxJson,
  updateNxJson,
  updateProjectConfiguration,
  type ProjectConfiguration,
  type ProjectGraph,
  type ProjectGraphProjectNode,
  type TargetConfiguration,
  type TargetDefaults,
  type Tree,
} from '@nx/devkit';
import type { BuildExecutorOptions } from '../../executors/build/schema';

export default async function (tree: Tree) {
  const graph = await createProjectGraphAsync();

  await processBuildExecutor(tree, graph);
  await processCheckExecutor(tree, graph);
  await processPreviewExecutor(tree, graph);

  cleanupOldTargetDefaults(tree, graph);

  await formatFiles(tree);
}

async function processBuildExecutor(tree: Tree, graph: ProjectGraph) {
  const executor = '@nxtensions/astro:build';
  const nxJson = readNxJson(tree);

  if (nxJson.targetDefaults?.[executor]) {
    // already set, don't override
    return;
  }

  nxJson.targetDefaults ??= {};
  const targets = getTargetsForExecutor(graph, executor);

  if (targets.size === 0) {
    return;
  }

  let existingTargetDefaults: Partial<TargetConfiguration>;
  if (targets.size === 1) {
    const targetName = Array.from(targets)[0];
    existingTargetDefaults = nxJson.targetDefaults[targetName];
  } else {
    // if there are multiple targets but a single target default, use that, otherwise don't set
    for (const target of targets) {
      if (existingTargetDefaults && nxJson.targetDefaults[target]) {
        return;
      }

      existingTargetDefaults = nxJson.targetDefaults[target];
    }
  }

  const buildTargetDefaults: TargetConfiguration<
    Partial<BuildExecutorOptions>
  > = (nxJson.targetDefaults[executor] = {});

  // all targets have the same name or there is a single target default
  if (existingTargetDefaults) {
    Object.assign(buildTargetDefaults, existingTargetDefaults);
  }

  buildTargetDefaults.cache ??= true;
  buildTargetDefaults.inputs ??= nxJson.namedInputs?.production
    ? ['production', '^production']
    : ['default', '^default'];
  buildTargetDefaults.outputs ??= ['{workspaceRoot}/dist/{projectRoot}'];

  updateNxJson(tree, nxJson);

  const projects = getProjects(tree);
  for (const [projectName, project] of projects) {
    for (const target of Object.values(project.targets)) {
      if (!target.executor || target.executor !== executor) {
        continue;
      }

      if (
        target.inputs &&
        JSON.stringify(target.inputs) ===
          JSON.stringify(buildTargetDefaults.inputs)
      ) {
        delete target.inputs;
      }
      if (
        target.outputs &&
        JSON.stringify(target.outputs) ===
          JSON.stringify(buildTargetDefaults.outputs)
      ) {
        delete target.outputs;
      }
      if (
        target.dependsOn &&
        JSON.stringify(target.dependsOn) ===
          JSON.stringify(buildTargetDefaults.dependsOn)
      ) {
        delete target.dependsOn;
      }
      if (
        target.cache === buildTargetDefaults.cache ||
        target.cache === undefined
      ) {
        delete target.cache;
      }
    }

    updateProjectConfiguration(tree, projectName, project);
  }
}

async function processCheckExecutor(tree: Tree, graph: ProjectGraph) {
  const executor = '@nxtensions/astro:check';
  const nxJson = readNxJson(tree);

  if (nxJson.targetDefaults?.[executor]) {
    // already set, don't override
    return;
  }

  nxJson.targetDefaults ??= {};
  const targets = getTargetsForExecutor(graph, executor);

  if (targets.size === 0) {
    return;
  }

  let existingTargetDefaults: Partial<TargetConfiguration>;
  if (targets.size === 1) {
    const targetName = Array.from(targets)[0];
    existingTargetDefaults = nxJson.targetDefaults[targetName];
  } else {
    // if there are multiple targets but a single target default, use that, otherwise don't set
    for (const target of targets) {
      if (existingTargetDefaults && nxJson.targetDefaults[target]) {
        return;
      }

      existingTargetDefaults = nxJson.targetDefaults[target];
    }
  }

  const checkTargetDefaults: TargetConfiguration = (nxJson.targetDefaults[
    executor
  ] = {});

  // all targets have the same name or there is a single target default
  if (existingTargetDefaults) {
    Object.assign(checkTargetDefaults, existingTargetDefaults);
  }

  checkTargetDefaults.cache ??= true;
  checkTargetDefaults.inputs ??= nxJson.namedInputs?.production
    ? ['production', '^production']
    : ['default', '^default'];

  updateNxJson(tree, nxJson);

  const projects = getProjects(tree);
  for (const [projectName, project] of projects) {
    for (const target of Object.values(project.targets)) {
      if (!target.executor || target.executor !== executor) {
        continue;
      }

      if (
        target.inputs &&
        JSON.stringify(target.inputs) ===
          JSON.stringify(checkTargetDefaults.inputs)
      ) {
        delete target.inputs;
      }
      if (
        target.cache === checkTargetDefaults.cache ||
        target.cache === undefined
      ) {
        delete target.cache;
      }
    }

    updateProjectConfiguration(tree, projectName, project);
  }
}

async function processPreviewExecutor(tree: Tree, graph: ProjectGraph) {
  const executor = '@nxtensions/astro:preview';
  const nxJson = readNxJson(tree);

  if (nxJson.targetDefaults?.[executor]) {
    // already set, don't override
    return;
  }

  nxJson.targetDefaults ??= {};
  const targets = getTargetsForExecutor(graph, executor);

  if (targets.size === 0) {
    return;
  }

  let existingTargetDefaults: Partial<TargetConfiguration>;
  if (targets.size === 1) {
    const targetName = Array.from(targets)[0];
    existingTargetDefaults = nxJson.targetDefaults[targetName];
  } else {
    // if there are multiple targets but a single target default, use that, otherwise don't set
    for (const target of targets) {
      if (existingTargetDefaults && nxJson.targetDefaults[target]) {
        return;
      }

      existingTargetDefaults = nxJson.targetDefaults[target];
    }
  }

  const previewTargetDefaults: TargetConfiguration = (nxJson.targetDefaults[
    executor
  ] = {});

  // all targets have the same name or there is a single target default
  if (existingTargetDefaults) {
    Object.assign(previewTargetDefaults, existingTargetDefaults);
  }

  previewTargetDefaults.dependsOn ??= ['build'];

  updateNxJson(tree, nxJson);

  const projects = getProjects(tree);
  for (const [projectName, project] of projects) {
    for (const target of Object.values(project.targets)) {
      if (!target.executor || target.executor !== executor) {
        continue;
      }

      if (
        target.dependsOn &&
        JSON.stringify(target.dependsOn) ===
          JSON.stringify(previewTargetDefaults.dependsOn)
      ) {
        delete target.dependsOn;
      }
    }

    updateProjectConfiguration(tree, projectName, project);
  }
}

function cleanupOldTargetDefaults(tree: Tree, graph: ProjectGraph) {
  const nxJson = readNxJson(tree);
  const projects = graph.nodes;
  const projectMap = getProjects(tree);

  for (const [targetDefaultKey, targetDefault] of Object.entries(
    nxJson.targetDefaults
  )) {
    if (
      !isTargetDefaultUsed(
        targetDefault,
        nxJson.targetDefaults,
        projects,
        projectMap
      )
    ) {
      delete nxJson.targetDefaults[targetDefaultKey];
    }
  }

  updateNxJson(tree, nxJson);
}

function getTargetsForExecutor(
  graph: ProjectGraph,
  executor: string
): Set<string> {
  const targets = new Set<string>();
  for (const node of Object.values(graph.nodes)) {
    for (const [targetName, target] of Object.entries(
      node.data?.targets ?? {}
    )) {
      if (target.executor === executor) {
        targets.add(targetName);
      }
    }
  }

  return targets;
}

function isTargetDefaultUsed(
  targetDefault: Partial<TargetConfiguration>,
  targetDefaults: TargetDefaults,
  projects: Record<string, ProjectGraphProjectNode>,
  projectMap: Map<string, ProjectConfiguration>
) {
  for (const p of Object.values(projects)) {
    for (const targetName in p.data?.targets ?? {}) {
      if (
        readTargetDefaultsForTarget(
          targetName,
          targetDefaults,
          projectMap.get(p.name)?.targets?.[targetName]?.executor
        ) === targetDefault
      ) {
        return true;
      }
    }
  }

  return false;
}

function readTargetDefaultsForTarget(
  targetName: string,
  targetDefaults: TargetConfiguration,
  executor: string | undefined
) {
  if (executor) {
    // prefer executor specific defaults
    const key = [executor, targetName].find((x) => targetDefaults?.[x]);
    return key ? targetDefaults?.[key] : null;
  }

  return targetDefaults?.[targetName];
}
