import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { PluginsConfig } from './PluginsConfig';

@Injectable({
  providedIn: 'root'
})
export class PluginsConfigProvider {
  config: PluginsConfig | undefined;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<PluginsConfig> {
    return this.http.get<PluginsConfig>(`assets/plugins-config.json`).pipe(
      tap(config => this.config = config)
    ).toPromise();
  }
}
