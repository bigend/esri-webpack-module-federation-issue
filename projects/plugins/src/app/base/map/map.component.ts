import { MapService } from 'shared';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import MapView from '@arcgis/core/views/MapView';
import { SharedService } from 'shared';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';

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
    debugger;

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
