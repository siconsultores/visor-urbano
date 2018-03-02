import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interaction, source, layer, style, Overlay, proj, coordinate} from 'openlayers';
import { SidePanelContentComponent } from '../../services/side-panel.interface';
import { MapEventType, MapService } from '../../services/map.service';
import { ProyeccionEnum } from '../../services/reproyeccion.service';
import {Punto, Linea, Poligono} from '../../common/geometria';

@Component({
  selector: 'sic-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.scss']
})
export class MeasureComponent implements OnInit, OnDestroy, SidePanelContentComponent {
  dibujoInteraction: any;

  vectorSource: any;
  vectorLayer: any;

  selected = 'POINT';

  helpOverlay: any;
  @ViewChild('tooltipHelp') tooltipHelp;
  tooltipHelpMessage = 'Da click sobre el mapa';
  showTooltipHelp = false;

  resultTooltip: string;

  @ViewChild('tooltipLocation') tooltipLocation;
  locationOverlay: any;

  @ViewChild('tooltipMeasure') tooltipMeasure;
  measureOverlay: any;

  hdms: string;
  altitud = '0 msnm';
  longitud: string;
  singleClickHandler: any;

  constructor(private mapService: MapService) { }
  show() { }
  hide() { }

  ngOnInit() {
    this.vectorSource = new source.Vector({wrapX: false});
    this.vectorLayer = new layer.Vector({
      source: this.vectorSource,
      style: new style.Style({
        stroke: new style.Stroke({
          color: '#FFFF00',
          width: 2,
          lineDash: undefined
        }),
        fill: new style.Fill({
          color: 'rgba(255, 255, 0, 0.3)',
        }),
        image: new style.Circle({
          radius: 5,
          fill: new style.Fill({
            color: '#FFFF00'
          })
        })
      }),
    });
    this.vectorLayer.setZIndex(10);
    this.mapService.__map.addLayer(this.vectorLayer);

    this.helpOverlay = new Overlay({
      element: this.tooltipHelp.nativeElement,
      offset: [15, 0],
      positioning: 'center-left'
    });

    this.singleClickHandler =  this.mapService.addEventHandler('singleclick', (evt) => { console.log('midiendo'); }, true);
    this.mapService.addEventHandler('pointermove', (evt) => {
      if (evt.dragging) {
        return;
      }
      this.helpOverlay.setPosition(evt.coordinate);
    }, true);
  }

  addPointMeasurementInteraction() {
    if (!!this.dibujoInteraction) {
      this.removeInteraction();
    }

    this.dibujoInteraction = new interaction.Draw({
      source: this.vectorSource,
      type: /** @type {ol.geom.GeometryType} */ ('Point'),
      freehand: true
    });

    this.mapService.addInteraction(this.dibujoInteraction);
    this.mapService.addOverlay(this.helpOverlay);
    this.tooltipHelpMessage = 'Da click sobre el mapa para conocer su ubicación';
    this.showTooltipHelp = true;

    this.selected = 'POINT';

    this.dibujoInteraction.on('drawend', (evt) => {
      this.vectorSource.clear();
      let coords = evt.feature.getGeometry().getCoordinates();
      coords = new Punto(coords[0], coords[1]);
      this.hdms = 'Ubicación X:' + coords.X.toFixed(2) + ' Y:' + coords.Y.toFixed(2);

      if (!!this.locationOverlay) {
        this.mapService.removeOverlay(this.locationOverlay);
        this.locationOverlay = null;
      }

      this.locationOverlay = new Overlay({
        element: this.tooltipLocation.nativeElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this.mapService.addOverlay(this.locationOverlay);
      this.locationOverlay.setPosition(evt.feature.getGeometry().getCoordinates());
      this.resultTooltip = 'location';
    });
  }

  addLineMeasurementInteraction() {
    if (!!this.dibujoInteraction) {
      this.removeInteraction();
    }

    this.dibujoInteraction = new interaction.Draw({
      source: this.vectorSource,
      type: /** @type {ol.geom.GeometryType} */ ('LineString'),
      freehand: false
    });

    this.mapService.addInteraction(this.dibujoInteraction);
    this.mapService.addOverlay(this.helpOverlay);
    this.tooltipHelpMessage = 'Da click sobre el mapa para comenzar a medir';
    this.showTooltipHelp = true;

    this.selected = 'LINE';

    this.dibujoInteraction.on('drawend', (evt) => {
      this.tooltipHelpMessage = 'Da click sobre el mapa para comenzar a medir';
      this.vectorSource.clear();
      // Generar Geometria Linea y acotar
    });

    this.dibujoInteraction.on('drawstart', (evt) => {
      this.tooltipHelpMessage = 'De doble click para terminar la medición';

      if (!!this.measureOverlay) {
        this.mapService.removeOverlay(this.measureOverlay);
        this.measureOverlay = null;
      }

      this.measureOverlay = new Overlay({
        element: this.tooltipMeasure.nativeElement,
        offset: [0, -15],
        positioning: 'bottom-center'
      });
      this.mapService.addOverlay(this.measureOverlay);
      this.measureOverlay.setPosition(evt.feature.getGeometry().getCoordinateAt(1));
      this.resultTooltip = 'measure';

      evt.feature.setStyle((feature, resolution) => new style.Style({
        stroke: new style.Stroke({
          color: '#00FFFF',
          width: 2,
          lineDash: undefined
        }),
      }));
      evt.feature.getGeometry().on('change', (geoEvt) => {
        console.log('Geometry', geoEvt);
        this.measureOverlay.setPosition(evt.feature.getGeometry().getLastCoordinate());
        this.longitud = evt.feature.getGeometry().getLength().toFixed(3) + ' mts';
      });
    });
  }

  addPolygonMeasurementInteraction() {
    if (!!this.dibujoInteraction) {
      this.removeInteraction();
    }

    this.dibujoInteraction = new interaction.Draw({
      source: this.vectorSource,
      type: /** @type {ol.geom.GeometryType} */ ('Polygon'),
      freehand: false
    });

    this.mapService.addInteraction(this.dibujoInteraction);
    this.mapService.addOverlay(this.helpOverlay);
    this.tooltipHelpMessage = 'Da click sobre el mapa para comenzar a medir';
    this.showTooltipHelp = true;

    this.selected = 'POLYGON';

    this.dibujoInteraction.on('drawend', (evt) => {
      this.tooltipHelpMessage = 'Da click sobre el mapa para comenzar a medir';
      this.vectorSource.clear();
      console.log(evt);
      console.log(evt.feature.getGeometry());
    });

    this.dibujoInteraction.on('drawstart', (evt) => {
      this.tooltipHelpMessage = 'De doble click para terminar la medición';
      evt.feature.setStyle((feature, resolution) => new style.Style({
        stroke: new style.Stroke({
          color: '#00FFFF',
          width: 2,
          lineDash: undefined
        }),
        fill: new style.Fill({
          color: 'rgba(0,255,255,0.2)',
        }),
        text: new style.Text({
          textAlign: 'center',
          textBaseline: 'middle',
          font: 'Bold 12px Arial',
          text: feature.getGeometry().getArea().toFixed(3) + ' mts2',
          fill: new style.Fill({
            color: '#000000'
          }),
          stroke: new style.Stroke({
            color: '#FFAA00',
            width: 2,
            lineDash: undefined
          }),
          offsetX: 0,
          offsetY: 0,
          rotation: 0
        })
      }));
      evt.feature.getGeometry().on('change', (geoEvt) => {
        console.log('Geometry', geoEvt);
      });
    });
  }

  removeInteraction() {
    this.longitud = '';
    this.hdms = '';
    this.tooltipHelpMessage = '';
    // Overlay de ubicacion
    if (!!this.locationOverlay) {
      this.mapService.removeOverlay(this.locationOverlay);
      this.locationOverlay = null;
    }
    // Overlay de ayuda
    if (!!this.helpOverlay) {
      this.mapService.removeOverlay(this.helpOverlay);
      this.locationOverlay = null;
    }
    // Overlay de medición
    if (!!this.measureOverlay) {
      this.mapService.removeOverlay(this.measureOverlay);
      this.measureOverlay = null;
    }
    this.showTooltipHelp = false;

    this.mapService.removeInteraction(this.dibujoInteraction);
    this.vectorSource.clear();
  }
  ngOnDestroy() {
    this.removeInteraction();
    this.vectorSource.clear();
    this.mapService.__map.removeLayer(this.vectorLayer);
    this.mapService.removeEventHandler(this.singleClickHandler);
  }

}
