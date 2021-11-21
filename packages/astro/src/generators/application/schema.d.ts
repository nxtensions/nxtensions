type Renderer =
  | '@astrojs/renderer-preact'
  | '@astrojs/renderer-react'
  | '@astrojs/renderer-solid'
  | '@astrojs/renderer-svelte'
  | '@astrojs/renderer-vue';

export interface GeneratorOptions {
  name: string;
  directory?: string;
  addCypressTests?: boolean;
  renderers?: Renderer[];
  standaloneConfig?: boolean;
  tags?: string;
}

interface NormalizedGeneratorOptions extends GeneratorOptions {
  addCypressTests: boolean;
  projectName: string;
  projectRoot: string;
  renderers: Renderer[];
  standaloneConfig: boolean;
  tags: string[];
}
