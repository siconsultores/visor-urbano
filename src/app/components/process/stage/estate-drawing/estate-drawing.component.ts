import { Component, OnInit } from '@angular/core';
import { geom, View, proj, Map, layer, style, source, interaction, Feature, control } from 'openlayers';
import { Constants } from '../../../../common/constants';
import { ProcessService } from '../../process.service';

@Component({
  selector: 'sic-estate-drawing',
  templateUrl: './estate-drawing.component.html',
  styleUrls: ['./estate-drawing.component.scss']
})
export class EstateDrawingComponent implements OnInit {

  constructor(private ps: ProcessService) { }

  estateData: any;

  map: Map;
  projection: proj.Projection;
  view: View;

  ngOnInit() {
    this.estateData = this.ps.estateData;

    this.projection = new proj.Projection({
      code: 'EPSG:6368',
      units: 'm',
      axisOrientation: 'neu'
    });

    this.view = new View({
      center: [672100.00000, 2287272.00000],
      zoom: 13,
      projection: this.projection
    });

    this.map = new Map({
      layers: [],
      controls: control.defaults({
        zoom: false,
        rotate: false,
        attribution: false
      }),
      interactions: interaction.defaults({
        dragPan: false,
        mouseWheelZoom: false,
        pinchRotate: false
      }),
      target: 'estate-map-container',
      view: this.view
    });

    this.viewMap();
  }


  viewMap() {
    this.map.getLayers().clear();

    const baseMapSource = new source.ImageWMS({
      url: Constants.GEOSERVER_URL + '/wms/',
      params: { 'LAYERS': 'gic:MapaBase,gic:PredioConstruccion', 'FORMAT': 'image/png', 'VERSION': '1.1.1' },
      serverType: 'geoserver',
      projection: this.projection
    });
    const baseMapLayer = new layer.Image({ source: baseMapSource });

    const vectorSourceEstate = new source.Vector({});
    const vectorLayerEstate = new layer.Vector({
      source: vectorSourceEstate,
      style: new style.Style({
        stroke: new style.Stroke({
          color: 'rgba(255,152,0,1)',
          width: 2
        }),
        fill: new style.Fill({
          color: 'rgba(255,152,0,0.6)'
        })
      })
    });

    this.map.addLayer(baseMapLayer);
    this.map.addLayer(vectorLayerEstate);

    const estatePolygon = new geom.Polygon(this.estateData.cartografia.poligono.geojson.geometry.coordinates);
    const estateFeature = new Feature(estatePolygon);
    vectorSourceEstate.addFeature(estateFeature);

    const zoomExtent = vectorLayerEstate.getSource().getExtent();
    const zoomOptions: any = {
      size: this.map.getSize()
    };

    this.map.getView().fit(zoomExtent, zoomOptions);
  }

  async downloadConstructionPlan() {
    const constructionPlan = await this.ps.getConstructionPlan(this.estateData.cartografia.clave).toPromise();
    window.open(constructionPlan.url, '_blank');
  }

}
