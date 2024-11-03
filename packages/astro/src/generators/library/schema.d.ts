export interface GeneratorOptions {
  directory: string;
  name?: string;
  importPath?: string;
  publishable?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  projectName: string;
  projectRoot: string;
  tags: string[];
}
