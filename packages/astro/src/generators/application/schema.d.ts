type Renderer =
  | '@astrojs/renderer-preact'
  | '@astrojs/renderer-react'
  | '@astrojs/renderer-solid'
  | '@astrojs/renderer-svelte'
  | '@astrojs/renderer-vue';

export interface GeneratorOptions {
  name: string;
  directory?: string;
  renderers?: Renderer[];
  standaloneConfig?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  renderers: Renderer[];
  standaloneConfig: boolean;
}
