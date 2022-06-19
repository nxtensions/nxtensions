export type IntegrationInfo = {
  name: string;
  packageName: string;
  dependencies: [name: string, version: string][];
};

export interface GeneratorOptions {
  name: string;
  addCypressTests?: boolean;
  directory?: string;
  integrations?: string[];
  standaloneConfig?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  addCypressTests: boolean;
  integrations: IntegrationInfo[];
  projectName: string;
  projectRoot: string;
  standaloneConfig: boolean;
  tags: string[];
}
