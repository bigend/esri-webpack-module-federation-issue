import { MapService } from 'shared';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import { SharedService } from 'shared';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Extent from '@arcgis/core/geometry/Extent';
import Locate from '@arcgis/core/widgets/Locate';
import Graphic from '@arcgis/core/Graphic';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('mapDivRef', { static: true, read: ViewContainerRef }) mapDivRef: ViewContainerRef;
  @ViewChild('locateDivRef', { static: true, read: ViewContainerRef }) locateRef: ViewContainerRef;

  private mapView: MapView;
  private scaleBar: ScaleBar;
  private locate: Locate;

  mapLoaded = false;

  constructor(private mapService: MapService,
    private sharedService: SharedService
  ) {

    this.sharedService.setComponent("MapComponent");
  }

  ngOnInit(): void {
    this.createMapView();
  }

  private createMapView(): void {
    this.mapView = this.mapService.createMapView(this.mapDivRef);
    if (this.mapService.mapLoaded === true) {
      this.onMapLoaded();
    } else {
      this.mapService.mapViewLoaded.subscribe(() => {
        this.onMapLoaded();
      });
    }


  }

  private onMapLoaded(): void {
    this.mapLoaded = true;
    this.createScaleBar();
    this.createLocate();
  }

  private createScaleBar(): void {
    this.scaleBar = new ScaleBar({
      view: this.mapView,
      // container: '',
      style: 'ruler',
      unit: 'metric',
      // visible: true
    });

    this.mapView.ui.add(this.scaleBar, {
      position: 'bottom-left'
    });

  }

  private createLocate(): void {
    this.locate = new Locate({
      view: this.mapView,
      container: this.locateRef.element.nativeElement,
      popupEnabled: false,
      graphic: new Graphic({
        // symbol: { type: 'simple-marker' }  // overwrites the default symbol used for the
        // graphic placed at the location of the user when found
      })
    });
  }

  zoomToHomeExtent(): void {

    const extent = new Extent({
      xmin: -7330167.1, ymin: 3729651.7, xmax: -7091703.7, ymax: -3894052.4, spatialReference: {
        wkid: 102100
      }
    });

    this.mapView.goTo(extent, { animate: false, duration: 0 });

  }

  ngOnDestroy(): void {

    if (this.mapService) {
      this.mapService.mapViewLoaded.unsubscribe();
      this.mapService.destroyMapView();
    }
    if (this.scaleBar) {
      this.scaleBar.destroy();
    }



  }

}
