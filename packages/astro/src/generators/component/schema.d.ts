export type Style = 'css' | 'scss' | 'sass' | 'less' | 'styl' | 'none';

export interface GeneratorOptions {
  path: string;
  name?: string;
  style?: Style;
}

export interface NormalizedGeneratorOptions extends Required<GeneratorOptions> {
  directory: string;
  fileName: string;
  filePath: string;
}
