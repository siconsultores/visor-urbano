import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LayerService } from '../../services/layer.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';  // tslint:disable-line
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Feature, geom, layer as olLayer, source, style as olStyle, proj} from 'openlayers';
import {IdentifyService} from './identify.service';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'sic-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.scss']
})
export class IdentifyComponent implements OnInit {

  handlerId;
  identifyCoordinates;
  identifyData;

  vectorSourceIdentify: source.Vector;
  vectorLayerIdentify: olLayer.Vector;

  constructor(private mapService: MapService, private layerService: LayerService,
              private http: Http, private identifyService: IdentifyService, private searchService: SearchService) {
    this.vectorSourceIdentify = new source.Vector({});

    this.identifyService.identifyChange$.subscribe(identify => {
      console.log('change');
      if (identify && !this.handlerId) {
        this.startIdentify();
      } else if (!identify && !!this.handlerId) {
        this.stopIdentify();
      }
    });
  }

  ngOnInit() {
  }

  cleanIdentify() {
    this.vectorSourceIdentify.clear();
    this.identifyData = null;
    this.identifyCoordinates = null;
  }


  private generateFeature(geometryJson) {
    console.log('Generate');
    console.log(geometryJson);
    switch (geometryJson.type) {
      case 'Polygon':
        const featPolygon = new geom.Polygon(geometryJson.coordinates);
        const dataFeaturePolygon = new Feature(featPolygon);
        dataFeaturePolygon.setStyle(new olStyle.Style({
          stroke: new olStyle.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
          }),
          fill: new olStyle.Fill({
            color: 'rgba(0, 0, 0, 0)'
          })
        }));
        return dataFeaturePolygon;
      case 'LineString':
        const featLineString = new geom.LineString(geometryJson.coordinates);
        const dataFeatureLinestring = new Feature(featLineString);
        dataFeatureLinestring.setStyle(new olStyle.Style({
          stroke: new olStyle.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
          })
        }));
        return dataFeatureLinestring;
      case 'Point':
        const featPoint = new geom.Point(geometryJson.coordinates);
        const dataFeaturePoint = new Feature(featPoint);
        dataFeaturePoint.setStyle(new olStyle.Style({
          image: new olStyle.Circle({
            radius: 3,
            fill: new olStyle.Fill({
              color: 'rgba(0, 0, 0, 0)'
            }),
            stroke: new olStyle.Stroke({
              color: 'blue',
              lineDash: [4],
              width: 3
            })
          })
        }));
        return dataFeaturePoint;
      default:
        console.error('Tipo no soportado');
        return null;
    }
  }

  toggleIdentify() {
    if (this.handlerId) {
      this.stopIdentify();
    } else {
      this.startIdentify();
    }
  }

  stopIdentify() {
    this.mapService.removeEventHandler( this.handlerId );
    this.handlerId = null;

    this.identifyService.stopIdentify();
  }

  startIdentify()  {

    this.handlerId = this.mapService.addEventHandler('singleclick', (evt) => {
      console.log('Clicked identify');

      this.vectorSourceIdentify.clear();
      if (!this.vectorLayerIdentify) {
        this.vectorLayerIdentify = new olLayer.Vector({
          source: this.vectorSourceIdentify,
          style: new olStyle.Style({
            image: new olStyle.Circle({
              radius: 5,
              fill: new olStyle.Fill({
                color: 'rgba(255,152,0,0.6)'
              }),
              stroke: new olStyle.Stroke({color: 'red', width: 1})
            })
          })
        });

        this.mapService.addLayer(this.vectorLayerIdentify );
      }

      const identifyPoint = new geom.Point(evt.coordinate, 'XY');
      const identifyFeature = new Feature(identifyPoint);
      identifyFeature.setStyle(new olStyle.Style({
        image: new olStyle.Circle({
          radius: 5,
          fill: new olStyle.Fill({
            color: 'rgba(255,152,0,0.6)'
          }),
          stroke: new olStyle.Stroke({color: 'red', width: 1})
        })
      }));
      // (this.vectorLayerIdentify.getSource() as source.Vector).addFeature(identifyFeature);
      this.vectorLayerIdentify.setVisible(true);

      const layers = this.layerService.layers
        .filter(x => x.original.selectable)
        .filter(x => x.layer.getVisible());

      const mapResolution = this.mapService.getView().getResolution();

      const delta = mapResolution * 16;
      const epsilon = mapResolution / 10;

      const minx = evt.coordinate[0] - epsilon,
        miny = evt.coordinate[1] + epsilon - delta,
        maxx = evt.coordinate[0] - epsilon + delta,
        maxy = evt.coordinate[1] + epsilon;

      const layerInfoUrl = layers.map(l => {

        const ccustom_url = `${l.original.source.url}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo` +
          '&FORMAT=image%2Fpng&TRANSPARENT=true&INFO_FORMAT=application%2Fjson&STYLES=' +
          '&FEATURE_COUNT=50&X=0&Y=0' +
          '&WIDTH=16&HEIGHT=16&SRS=EPSG%3A6368' +
          `&QUERY_LAYERS=${l.original.source.params.LAYERS}&LAYERS=${l.original.source.params.LAYERS}` +
          `&BBOX=${minx}%2C${miny}%2C${maxx}%2C${maxy}`;

        return {
          layer: l.title,
          url: ccustom_url
        };
      });

      Observable.forkJoin([
        ...layerInfoUrl.map(layer =>
          this.http.get(layer.url)
            .map(resp => ({
                layer: layer.layer,
                data: resp.json().features.map(f => ({ layer: f.id.split('.')[0], properties: f.properties, geometry: f.geometry }))
                  .reduce((a, f) => {
                    a[f.layer] = !! a[f.layer]
                      ? [...a[f.layer], {properties: f.properties, geometry: f.geometry}]
                      : [{properties: f.properties, geometry: f.geometry}];
                    return a;
                  }, {})
              })
            ))
      ]).subscribe(data => {
        data.forEach(layer => {
          Object.entries(layer.data).forEach( ([key, val]) => {
            val.forEach(f => {
              const dataFeature = this.generateFeature(f.geometry);
              if (!!dataFeature) {
                (this.vectorLayerIdentify.getSource() as source.Vector).addFeature(dataFeature);
              }
            });
          });
        });
        const datos = data.map(x => {
          return {
            name: x.layer,
            layers: Object.entries(x.data).map(([key, value]) => {
              return value.map(feat => {
                return {
                  name: key,
                  properties: Object.entries(feat.properties).map(([k, v]) => ({ key: k, value: v }))
                };
              });
            }).reduce((a, b) => [...a, ...b], [])
          };
        });

        const SearchFeatures = {
          name: 'Resultado Búsqueda',
          layers: this.searchService.GetFeatureAtCoordinate(evt.coordinate).map((f, idx) => {
            return {
              name: `Resultado ${idx + 1}`,
              properties: Object.entries(f.getProperties())
                .filter(([k, v]) => ['geometry'].indexOf(k) === -1)
                .map(([k, v]) => ({ key: k, value: v }))
            };
          })
        };

        this.identifyData = [...datos, SearchFeatures].filter(x => x.layers.length > 0);
        this.identifyCoordinates = evt.coordinate;
      });
    }, true);

    this.identifyService.startIdentify();
  }

}
