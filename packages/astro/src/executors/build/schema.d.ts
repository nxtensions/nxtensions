export interface BuildExecutorOptions {
  config?: string;
  drafts?: boolean;
  deleteOutputPath?: boolean;
  experimentalSsr?: boolean;
  experimentalStaticBuild?: boolean;
  silent?: boolean;
  sitemap?: boolean;
  verbose?: boolean;
}
