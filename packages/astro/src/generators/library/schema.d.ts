import type { ProjectNameAndRootFormat } from '@nx/devkit/src/generators/project-name-and-root-utils';

export interface GeneratorOptions {
  name: string;
  directory?: string;
  importPath?: string;
  projectNameAndRootFormat?: ProjectNameAndRootFormat;
  publishable?: boolean;
  tags?: string;

  /**
   * This option is no longer used and will be removed in v19.
   */
  standaloneConfig?: boolean;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  projectName: string;
  projectRoot: string;
  tags: string[];
}
