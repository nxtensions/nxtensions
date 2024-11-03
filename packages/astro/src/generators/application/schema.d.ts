export type IntegrationInfo = {
  name: string;
  packageName: string;
  dependencies: [name: string, version: string][];
};
export type E2eTestRunner = 'none' | 'cypress' | 'playwright';

export interface GeneratorOptions {
  directory: string;
  name?: string;
  e2eTestRunner?: E2eTestRunner;
  integrations?: string[];
  tags?: string;
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
