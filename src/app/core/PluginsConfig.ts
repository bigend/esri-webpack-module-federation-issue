export interface PluginsConfig {
  [key: string]: {
    mfEntry: string;
    name: string;
    exposedModule: string;
    ngModuleName: string;
  };
}
