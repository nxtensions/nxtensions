export interface GeneratorOptions {
  name: string;
  directory?: string;
  importPath?: string;
  publishable?: boolean;
  standaloneConfig?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  importPath: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  standaloneConfig: boolean;
}
