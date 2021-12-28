import { Injectable, Type } from '@angular/core';
import { PluginsConfigProvider } from './plugins-config.provider';
import { LayoutContainerName } from './layout-container-name';


const containerMap = {};
const remoteMap = {};
let isDefaultScopeInitialized = false;

const moduleMap = {};
function loadRemote(remoteEntry: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    //@ts-ignore
    if (containerMap[remoteEntry]) {
      //@ts-ignore
      resovle(containerMap[remoteEntry]);
    }
    //@ts-ignore
    import(/* webpackIgnore:true */ remoteEntry).then(container => {
      //@ts-ignore
      containerMap[remoteEntry] = container;
      resolve(container);
    });

  });
}

@Injectable({
  providedIn: 'root'
})
export class PluginLoaderService {
  constructor(private configProvider: PluginsConfigProvider) {

    console.log(" --- Plugin loader service hit.");

  }
  //@ts-ignore
  async load<T>(pluginName): Promise<Type<T>> {

    const { config } = this.configProvider;
    //@ts-ignore
    if (!config[pluginName]) {
      throw Error(`Can't find appropriate plugin`);
    }
    //@ts-ignore
    let { name, mfEntry, exposedModule, ngModuleName, layoutContainerName } = config[pluginName];
    await loadRemote(mfEntry);
    if (!isDefaultScopeInitialized) {
      //@ts-ignore
      await __webpack_init_sharing__('default');
      isDefaultScopeInitialized = true;
    }
    //@ts-ignore
    let container = containerMap[mfEntry];
    //@ts-ignore
    container.init(__webpack_share_scopes__.default)
    const factory = await container.get(exposedModule);
    const Module = factory();
    return Module[ngModuleName];
  }

  async loadPluginsForLayoutContainer(label: LayoutContainerName): Promise<any[]> {
    const { config } = this.configProvider;
    const pluginFactories: any[] = [];
    // @ts-ignore
    for (const pluginConfig of Object.entries(config)) {
      //@ts-ignore
      const [pluginName, { mfEntry, name, exposedModule, ngModuleName, layoutContainerName }] = pluginConfig;
      if (layoutContainerName === label) {
        const pluginFactory = await this.load(pluginName);
        pluginFactories.push(pluginFactory);
      }
    }
    return pluginFactories;
  }

}
