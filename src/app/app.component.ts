import { SharedService } from 'shared';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PluginLoaderService } from './core/plugin-loader.service';
import { LayoutContainerName } from './core/layout-container-name';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { loadRemoteEntry } from '@angular-architects/module-federation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  @ViewChild('targetRef', { static: true, read: ViewContainerRef }) vcRef: ViewContainerRef;
  @ViewChild('rootRef', { static: true, read: ViewContainerRef }) rootRef: ViewContainerRef;

  constructor(private sharedService: SharedService,
    private pluginLoader: PluginLoaderService,
    private factoryResolver: ComponentFactoryResolver,) {
    sharedService.setComponent('AppComponent');

  }

  // async ngOnInit(): Promise<any> {
  ngOnInit(): void {
    // this.loadPlugin('plugin1');

    // load plugins placing them into given layout containers based on LayoutContainerName enum
    // this.loadTools();
    // this.loadRightPanel();
    debugger;
    // this.createMapComponent();

    this.createPluginComponent(LayoutContainerName.base, this.rootRef);
  }

  createMapComponent() {
    // Promise.all([
    //   loadRemoteEntry({ remoteEntry: 'http://localhost:4201/BasePluginRemoteEntry.js', type: 'module' })
    // ])
    //   // .catch(err => console.error('Error loading remote entries', err))
    //   .then((r) => {
    //     const a = r;
    //     debugger;
    //     // import('./bootstrap')
    //   })
    //   .catch(err => {
    //     debugger;
    //     console.error(err)
    //   });
    // debugger;
    loadRemoteModule({
      remoteEntry: 'http://localhost:4201/BasePluginRemoteEntry.js',
      // remoteName: 'BasePlugin',
      exposedModule: './Module',
      type: 'module'
    }).then(
      m => {
        debugger;
      }
    ).catch(e => {
      console.error(e);
      debugger;
    })
  }

  // loadPlugin(pluginName: string): void {
  //   //@ts-ignore
  //   this.pluginLoader.load(pluginName).then((component: Type<any>) => {
  //     const compFactory = this.factoryResolver.resolveComponentFactory(
  //       component
  //     );
  //     this.vcRef.createComponent(compFactory);
  //   }).catch(ex => {
  //     console.log(ex);
  //   });
  // }

  createPluginComponent(label: LayoutContainerName, viewChild: ViewContainerRef): void {
    this.pluginLoader.loadPluginsForLayoutContainer(label)
      //@ts-ignore
      .then((components: Type<any>[]) => {
        debugger;
        components.forEach(component => {
          debugger;
          const compFactory = this.factoryResolver.resolveComponentFactory(
            component
          );
          viewChild.createComponent(compFactory);
        });
      }).catch(ex => {
        console.log(ex);
      });
  }

}
