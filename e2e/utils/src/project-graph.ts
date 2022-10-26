import type { ProjectGraph } from '@nrwl/devkit';
import { readJsonFile } from '@nrwl/devkit';
import { runNxCommandAsync, tmpProjPath } from '@nrwl/nx-plugin/testing';
import { rm } from 'fs-extra';
import { join } from 'path';

export async function readProjectGraph(): Promise<ProjectGraph> {
  const graphFilePath = join(tmpProjPath(), 'graph.json');
  await runNxCommandAsync(`graph --file ${graphFilePath}`);
  const { graph } = readJsonFile(graphFilePath);
  await rm(graphFilePath);

  return graph;
}
