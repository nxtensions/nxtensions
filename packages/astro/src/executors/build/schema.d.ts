export interface BuildExecutorOptions {
  config?: string;
  drafts?: boolean;
  deleteOutputPath?: boolean;
  host?: boolean | string;
  silent?: boolean;
  site?: string;
  verbose?: boolean;
  generatePackageJson?: boolean;
  includeDevDependenciesInPackageJson?: boolean;
}
