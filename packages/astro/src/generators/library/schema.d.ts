export interface GeneratorOptions {
  name: string;
  directory?: string;
  importPath?: string;
  publishable?: boolean;
  standaloneConfig?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends Required<GeneratorOptions> {
  projectName: string;
  projectRoot: string;
  tags: string[];
}
