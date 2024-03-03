import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export type IntegrationInfo = {
  name: string;
  packageName: string;
  dependencies: [name: string, version: string][];
};
export type E2eTestRunner = 'none' | 'cypress' | 'playwright';

export interface GeneratorOptions {
  name: string;
  directory?: string;
  e2eTestRunner?: E2eTestRunner;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  integrations?: string[];
  tags?: string;

  /**
   * @deprecated Use the `--e2eTestRunner` option instead. This option will be removed in v19.
   */
  addCypressTests?: boolean;
  /**
   * @deprecated This option is no longer used and will be removed in v19.
   */
  standaloneConfig?: boolean;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  e2eTestRunner: E2eTestRunner;
  integrations: IntegrationInfo[];
  projectName: string;
  projectRoot: string;
  e2eProjectName: string;
  e2eProjectRoot: string;
  tags: string[];
}
