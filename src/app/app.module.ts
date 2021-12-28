import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PluginsConfigProvider } from './core/plugins-config.provider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule
  ],
  providers: [
    PluginsConfigProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: (provider: PluginsConfigProvider) => () =>
        provider.loadConfig(),
      multi: true,
      deps: [PluginsConfigProvider]
    }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
