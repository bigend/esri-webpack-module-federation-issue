import { SharedService } from 'shared';
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PluginLoaderService } from './core/plugin-loader.service';
import { LayoutContainerName } from './core/layout-container-name';

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

  ngOnInit(): void {
    this.createPluginComponent(LayoutContainerName.base, this.rootRef);
  }

  createPluginComponent(label: LayoutContainerName, viewChild: ViewContainerRef): void {
    this.pluginLoader.loadPluginsForLayoutContainer(label)
      //@ts-ignore
      .then((components: Type<any>[]) => {

        components.forEach(component => {

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
