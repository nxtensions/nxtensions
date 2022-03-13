export interface BuildExecutorOptions {
  config?: string;
  drafts?: boolean;
  deleteOutputPath?: boolean;
  experimentalSsr?: boolean;
  legacyBuild?: boolean;
  silent?: boolean;
  site?: string;
  sitemap?: boolean;
  verbose?: boolean;
}
