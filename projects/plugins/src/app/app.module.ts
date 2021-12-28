import { MapComponent } from './base/map/map.component';
import { BaseModule } from './base/base.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BaseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
