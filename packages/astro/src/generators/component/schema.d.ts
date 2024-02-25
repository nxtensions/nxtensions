import type { NameAndDirectoryFormat } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

export type Style = 'css' | 'scss' | 'sass' | 'less' | 'styl' | 'none';

export interface GeneratorOptions {
  name: string;
  directory?: string;
  nameAndDirectoryFormat?: NameAndDirectoryFormat;
  style?: Style;

  /**
   * @deprecated
   */
  capitalizeName?: boolean;
  /**
   * @deprecated
   */
  project?: string;
}

export interface NormalizedGeneratorOptions extends GeneratorOptions {
  directory: string;
  fileName: string;
  filePath: string;
  style: Style;
}
