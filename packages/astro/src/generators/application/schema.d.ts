import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export type IntegrationInfo = {
  name: string;
  packageName: string;
  dependencies: [name: string, version: string][];
};

export interface GeneratorOptions {
  name: string;
  addCypressTests?: boolean;
  directory?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  integrations?: string[];
  tags?: string;

  /**
   * @deprecated This option is no longer used and will be removed in v19.
   */
  standaloneConfig?: boolean;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  addCypressTests: boolean;
  integrations: IntegrationInfo[];
  projectName: string;
  projectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  tags: string[];
}
