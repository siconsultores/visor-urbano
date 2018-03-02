import { Component, AfterViewInit } from '@angular/core';
import { View, Map, layer, source, interaction, control, proj } from 'openlayers';
import { MapService } from '../../services/map.service';
import {LayerService} from '../../services/layer.service';

@Component({
  selector: 'sic-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.scss']
})
export class MapViewerComponent implements AfterViewInit {

  map: Map;
  mapId: string;

  constructor(private layerService: LayerService, private ms: MapService) {
    this.mapId = 'MapContainerElementId';
  }

  ngAfterViewInit() {
    const projection = new proj.Projection({
      code: 'EPSG:6368',
      units: 'm',
      axisOrientation: 'neu'
    });

    const view = new View({
      center: [672100.00000, 2287272.00000],
      zoom: 13,
      minZoom: 12,
      maxZoom: 21,
      projection: projection
    });

    this.map = this.ms.createMap({
      layers: [
        new layer.Tile({
          opacity: 0.5,
          minResolution: 19.087865229838002 / 3,
          maxResolution: 19.087865229838002 * 4,
          source: new source.TileWMS({
            url: 'http://sigmetro.imeplan.mx:8080/geoserver/imeplan/wms',
            params: {
              'LAYERS': 'imeplan:MapaBase',
              'FORMAT': 'image/png',
              'VERSION': '1.1.1'
            },
            serverType: 'geoserver',
            projection: new proj.Projection( {
              'code': 'EPSG:6368',
              'units': 'm',
              'axisOrientation': 'neu'
            })
          })
        }),
      ],
      target: this.mapId,
      interactions: interaction.defaults({
        altShiftDragRotate: false,
        pinchRotate: false
      }),
      controls: control.defaults({
        rotate: false,
        attribution: false,
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      view: view
    });

    this.layerService.loadLayers().subscribe(layers => {
      layers.forEach(l => {
        this.ms.addLayer2(l);
      });
    });


  }

}
