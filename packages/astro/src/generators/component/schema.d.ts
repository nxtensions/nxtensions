export type Style = 'css' | 'scss' | 'sass' | 'less' | 'styl' | 'none';

export interface GeneratorOptions {
  name: string;
  project: string;
  directory?: string;
  style?: Style;
}

export type NormalizedGeneratorOptions = Required<GeneratorOptions>;
