import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Constants} from '../common/constants';

import 'rxjs/add/operator/mergeMap';

import API_URL = Constants.API_URL;

@Injectable()
export class EstateService {

  private _activeEstate: any;

  constructor(private http: Http) { }

  getPredioAtPoint(x, y) {
    return this.http.post(`${API_URL}/espacial/intersection/Predio`, {geometry: {
        type: 'Point',
        coordinates: [x, y]
      }}).map(resp => {
        const predios = resp.json().map(p => {
          p.geometry = JSON.parse(p.geometry);
          delete p.geom;
          return p;
        });

        if (predios.length !== 1) {
          throw new Error(`Expected 1 Predio but get ${predios.length}`);
        }

        return predios[0];
      });
  }

  getPredioByClave(clave) {
    return this.http.get(`${API_URL}/catastro/predio/vu`, { search: {clave: clave}}).map(resp => {
      console.log('Padron response: ', resp);
      return resp.json().data;
    });
  }

  postZonificacion(geom: any) {
    return this.http.post(`${Constants.API_URL}/tramite/Zonificacion`, geom).map(data => data.json());
  }

  getLicenciasActiveEstate() {
    // this.getLicenciasConstruccionActiveEstate();
    if (this._activeEstate) {

      this.http.get(`${API_URL}/catastro/predio/licencia?clave=${this._activeEstate.claveCatastral}`)
        .map(resp => resp.json()).subscribe(d => {
          console.log('licencias: ', d);
        });

      return this.http.post(`${API_URL}/espacial/intersection/v2/LicenciasActivas`, {
        geometry: this._activeEstate.cartografia.poligono.geojson.geometry
      }).map(resp => resp.json());
    } else {
      return null;
    }
  }

  getLicenciasConstruccionActiveEstate() {
    if (this._activeEstate) {

      /*
      console.log('Lico: ', this._activeEstate.cartografia.poligono.geojson.geometry.coordinates);
      const estatePolygon = new geom.Polygon(this._activeEstate.cartografia.poligono.geojson.geometry.coordinates);
      const geometry = new geom.Polygon(this._activeEstate.cartografia.poligono.geojson.geometry.coordinates, 'XY');

      console.log(geometry, geometry.getArea());

      const spatialFilter = new format.filter.Intersects(
        'Geom',
        estatePolygon,
        'EPSG:6368'
      );

      console.log('Filtrantemente');

      const wfsFormat = new format.WFS({
        featureNS: 'http://mapa.guadalajara.gob.mx:8080/'
      });

      console.log(wfsFormat);

      const featureRequest = wfsFormat.writeGetFeature({
        srsName: 'EPSG:6368',
        featureNS: 'https://mapa.guadalajara.gob.mx/leafletvisor',
        featurePrefix: 'leafletvisor',
        featureTypes: ['leafletvisor:V_LicenciasGeo_estatus'],
        outputFormat: 'application/json',
        filter: spatialFilter,
        resultType: 'results'
      });

      console.log('requested');

      console.log(new XMLSerializer().serializeToString(featureRequest));

      fetch('http://mapa.guadalajara.gob.mx:8080/geoserver/leafletvisor/wfs', {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
      }).then(response => {
        return response.json();
      }).then(data => {
        console.log('LiConstru', data);
        const features = new ol.format.GeoJSON().readFeatures(data);
        // vectorSource.addFeatures(features);
        // map.getView().fit(vectorSource.getExtent());
      });

      */


      const parameters = {};
      parameters['service'] = 'WFS';
      parameters['version'] = '2.0.0';
      parameters['request'] = 'GetFeature';
      parameters['outputFormat']  = 'application/json';
      parameters['maxFeatures'] = '10000';
      parameters['typeNames'] = 'leafletvisor:V_LicenciasGeo_estatus';
      // let strPoints: string = '';

      let strPoints = this._activeEstate.cartografia.poligono.geojson.geometry.coordinates[0].map(coord => {
        return `${coord[0]}%20${coord[1]},`;
      }).join('');

      strPoints += strPoints.split(',')[0];
      parameters['cql_filter'] = 'INTERSECTS(geom,%20POLYGON%20((' + strPoints + ')))';

      console.log(parameters);

      return this.http.post(`${API_URL}/espacial/intersection/v2/LicenciasConstruccion`, {
        geometry: this._activeEstate.cartografia.poligono.geojson.geometry
      }).map(resp => resp.json());
    } else {
      return null;
    }
  }

  setActive(estate) {
    this._activeEstate = estate;
  }

  getActiveEstate() {
    return this._activeEstate;
  }

  cleanActiveEstate() {
    this._activeEstate = null;
  }

}
