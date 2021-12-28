import { ElementRef, Injectable, ViewContainerRef } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Map from '@arcgis/core/Map';
import Locate from '@arcgis/core/widgets/Locate';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private mapView: MapView;
  mapLoaded = false;
  private map: Map;
  mapViewLoaded = new Subject();
  private baseLyrUrl = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";

  constructor() { }

  /*
 * Creates map view in provided element
 * @param baseLyrUrl url to basemap layer
 * @param mapContainerRef element reference where map view will be created
 * */
  createMapView(mapContainterRef: ViewContainerRef): MapView {

    this.map = this.createMap(this.baseLyrUrl);
    this.mapView = new MapView({
      container: mapContainterRef.element.nativeElement,
      map: this.map,

    });
    this.mapView.navigation.momentumEnabled = false;

    // const locate = new Locate({
    //   view: this.mapView,

    // });
    // this.mapView.ui.add(locate, 'bottom-right');

    this.mapView.when(() => {
      this.mapLoaded = true;
      this.mapViewLoaded.next();
    }, (error: any) => {
      console.error(`Map failed to load, error: ${error}`);
    }
    );

    return this.mapView;

  }

  private createMap(baseLyrUrl: string): Map {
    const basemap = this.getBasemap(baseLyrUrl);
    const map = new Map({
      basemap
    });

    return map;
  }

  private getBasemap(baseLyrUrl: string): Basemap {
    const basemapTileLayer: TileLayer = new TileLayer(
      {
        url: baseLyrUrl,
        id: 'basemapLyr'
      }
    );

    const basemap: Basemap = new Basemap({
      baseLayers: [basemapTileLayer],
      // title, id, thumbnail;
    });

    return basemap;

  }

  public destroyMapView(): void {
    if (this.mapView) {

      if (this.mapView.map) {
        this.mapView.map.destroy();
      }

      this.mapView.destroy();

    }
  }
}
