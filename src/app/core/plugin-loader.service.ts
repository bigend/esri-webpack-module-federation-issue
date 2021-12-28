import { Injectable, Type } from '@angular/core';
import { PluginsConfigProvider } from './plugins-config.provider';
import { LayoutContainerName } from './layout-container-name';
// import { loadRemoteModule } from '@angular-architects/module-federation';
//@ts-ignore
import { loadRemoteEntry, lookupExposedModule, loadRemoteModule } from './mfLoader.js';
// import { loadRemote } from './importer.js';
// const moduleMap = {};
// function loadRemoteEntry(remoteEntry: string): Promise<void> {
//   return new Promise<any>((resolve, reject) => {
//     //@ts-ignore
//     if (moduleMap[remoteEntry]) {
//       resolve(remoteEntry);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = remoteEntry;

//     script.onerror = reject;

//     script.onload = () => {
//       //@ts-ignore
//       moduleMap[remoteEntry] = true;
//       resolve(remoteEntry); // window is the global namespace
//     };

//     document.body.append(script);
//   });
// }

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
    // await loadRemoteEntry(mfEntry);
    // await loadRemoteEntry({ type: 'module', remoteEntry: 'http://localhost:4201/BasePluginRemoteEntry.js' })
    debugger;
    const remoteEntry = 'http://localhost:4201/BasePluginRemoteEntry.js';
    // exposedModule = "MapComponent";
    // loadRemoteEntry({ type: 'module', remoteEntry: 'http://localhost:4201/BasePluginRemoteEntry.js' }).then(() => {
    //   console.log("remote entry loaded");
    //   debugger;
    // })
    await loadRemote(remoteEntry);
    if (!isDefaultScopeInitialized) {
      //@ts-ignore
      await __webpack_init_sharing__('default');
      isDefaultScopeInitialized = true;
    }
    // const module = await lookupExposedModule('http://localhost:4201/BasePluginRemoteEntry.js', './MapComponent');
    //@ts-ignore
    let container = containerMap[remoteEntry];
    //@ts-ignore
    container.init(__webpack_share_scopes__.default)
    // return container.get(exposedModule).then((f: any) => {
    //   debugger;
    //   const a = f;
    //   const Module = f();
    //   return Module(ngModuleName);

    // }).catch((e: any) => {
    //   debugger;
    //   console.error(e);
    // })
    const factory = await container.get(exposedModule);
    const Module = factory();
    debugger;
    return Module[ngModuleName];


    //@ts-ignore
    // return module["MapComponent"];
    // //@ts-ignore
    // await __webpack_init_sharing__('default');
    // //@ts-ignore
    // const container = window[name] as Container;
    // // const container = await loadRemote(mfEntry);
    // // Initialize the container, it may provide shared modules
    // //@ts-ignore
    // await container.init(__webpack_share_scopes__.default);
    // const factory = await container.get(exposedModule);
    // const Module = factory();

    // return Module[ngModuleName];
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
        debugger;
        pluginFactories.push(pluginFactory);
      }
    }
    // const pf = await this.load('mapComponent');

    return pluginFactories;
  }

}
