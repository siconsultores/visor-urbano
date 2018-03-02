import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MapService } from './map.service';
import { Constants } from '../common/constants';
import { Observable } from 'rxjs/Observable';
import { View, Map, source, layer, style, format, proj, interaction, events } from 'openlayers';

@Injectable()
export class SearchService {
  constructor(private ms: MapService, private http: Http) { }
  vectorLayer: layer.Vector;
  configureQuery(criterio: string) {
    criterio = criterio.toUpperCase();
    const query: QueryParameter = this.EvaluateQuery(criterio);
    return query;
  }
  executeQuery(query: QueryParameter) {
    return this.http.get(Constants.API_URL + '/catastro/' + query.layer + '?' + query.queryParam);
  }

  EvaluateQuery(criterio: string): QueryParameter {
    let query: QueryParameter;
    // predio
    query = this.isPredioQuery(criterio);
    if (query.found) {
      return query;
    }
    // manzana
    query = this.isManzanaQuery(criterio);
    if (query.found) {
      return query;
    }
    // colonia
    query = this.isColoniaQuery(criterio);
    if (query.found) {
      return query;
    }
    // condominio
    query = this.isCondominioQuery(criterio);
    if (query.found) {
      return query;
    }
    // TODO cruce de calle
    // TODO Tramo NEVER
    // redvial
    query = this.isRedVialQuery(criterio);
    if (query.found) {
      return query;
    }

  }

  isPredioQuery(criterio: string) {
    const query: QueryParameter = { layer: 'predio', found: false, queryParam: '' };

    // por Clave
    if ((criterio.length === 11 || criterio.length === 14) && criterio[0] === 'D') {
      criterio = criterio.length === 11 ? `${criterio}000` : criterio;
      query.queryParam = `clave=${criterio}`;
      query.found = true;
      return query;
    }

    // Cuenta sin guiones
    let recaudadoraCuenta: any = {};
    let tipo = '';
    if (criterio.split('U').length === 2) {
      recaudadoraCuenta = criterio.split('U');
      tipo = 'U';
    } else if (criterio.split('R').length === 2) {
      recaudadoraCuenta = criterio.split('R');
      tipo = 'R';
    }

    if (recaudadoraCuenta.length === 2 && Number(recaudadoraCuenta[0]).toString() !== 'NaN' &&
      Number(recaudadoraCuenta[1]).toString() !== 'NaN') {
      query.queryParam = `recaudadora=${recaudadoraCuenta[0]}&tipoPredio=${tipo}&cuenta=${recaudadoraCuenta[1]}`;
      query.found = true;
      return query;
    }

    // Cuenta con guiones
    let cuenta: any = {};
    cuenta = criterio.split('-');
    if (cuenta.length === 3 && Number(cuenta[0]).toString() !== 'NaN' &&
      (cuenta[1] === 'U' || cuenta[1] === 'R') && Number(cuenta[2]).toString() !== 'NaN') {
      query.queryParam = `recaudadora=${cuenta[0]}&tipoPredio=${cuenta[1]}&cuenta=${cuenta[2]}`;
      query.found = true;
      return query;
    }

    // Domicilio Calle, Numero Exterior
    const domicilio: any = criterio.split(' ');
    if (domicilio.length >= 2) {
      if (isNaN(Number(domicilio[domicilio.length - 1].toString())) === false) {
        let calle = '';
        for (let ix = 0; ix < domicilio.length - 1; ix++) {
          calle += domicilio[ix] + ' ';
        }
        calle = calle.substring(0, calle.length - 1);
        query.queryParam = `calle=${calle}&numeroExterior=${domicilio[domicilio.length - 1].trim()}`;
        query.found = true;
        return query;
      }
    }
    return query;
  }

  isManzanaQuery(criterio: string) {
    const query: QueryParameter = { layer: 'manzana', found: false, queryParam: '' };
    // Clave
    if (criterio.length === 8 && criterio[0] === 'D') {
      query.queryParam = `clave=${criterio}`;
      query.found = true;
      return query;
    }
    return query;
  }

  isColoniaQuery(criterio: string) {
    const query: QueryParameter = { layer: 'colonia', found: false, queryParam: '' };
    // Nombre de Colonia
    if (criterio.length > 0 && criterio.indexOf('COLONIA') >= 0) {
      query.found = true;
      query.queryParam = `nombre=${criterio.replace('COLONIA', '').trim()}`;
      return query;
    } else if (Number(criterio).toString() !== 'NaN') {
      // TODO: Codigo Postal
    }
    return query;
  }

  isCondominioQuery(criterio: string) {
    const query: QueryParameter = { layer: 'condominio', found: false, queryParam: '' };
    // Nombre de Condominio
    if (criterio.length > 0 && criterio.indexOf('CONDOMINIO') >= 0) {
      query.queryParam = `nombre=${criterio.replace('CONDOMINIO', '').trim()}`;
      query.found = true;
      return query;
    }
    return query;
  }
  isRedVialQuery(criterio: string) {
    const query: QueryParameter = { layer: 'redvial', found: false, queryParam: '' };
    if (criterio.length > 5) {
      query.queryParam = `nombre=${criterio}`;
      query.found = true;
      return query;
    }
    return query;
  }
  // Se removeran cuando se termine de desarrollar el mapService
  AddVectorLayer() {
    if (this.vectorLayer === undefined) {
      this.vectorLayer = this.CreateVectorLayer();
      this.ms.__map.addLayer(this.vectorLayer);
    }
  }
  ClearVectorLayer() {
    if (!!this.vectorLayer) {
      this.vectorLayer.getSource().clear();
    }
  }

  GetFeatureAtCoordinate(coord) {
    if (this.vectorLayer) {
      return this.vectorLayer.getSource().getFeaturesAtCoordinate(coord);
    } else {
      return [];
    }
  }

  CreateVectorLayer() {

    const vectorSource = new source.Vector();
    const vector = new layer.Vector({
      source: vectorSource,
      style: new style.Style({
        stroke: new style.Stroke({
          color: 'rgba(255,152,0,1)',
          width: 6
        }),
        image: new style.Icon({
          src: 'http://www.clker.com/cliparts/I/l/L/S/W/9/map-marker-md.png',
          scale: 0.1,
        }),
        fill: new style.Fill({
          color: 'rgba(255,152,0,0.6)',
        })
      })
    });
    return vector;
  }
  ShowFeaturesResult(features: any) {
    if (features.length > 0) {
      this.vectorLayer.getSource().addFeatures(features);
      this.ms.__map.getView().fit(this.vectorLayer.getSource().getExtent());
    }
  }
  AddFeature(feature: any) {
    this.vectorLayer.getSource().addFeature(feature);
  }
  ZoomSelection() {
    this.ms.__map.getView().fit(this.vectorLayer.getSource().getExtent());
  }
  // Se quitaran cuando se termine de desarrollar el map service

  GetHistorySearch() {
    const strHistorySearch: String = localStorage.getItem('historySearchVU');
    if (strHistorySearch === undefined || strHistorySearch === null) {
      return [];
    }
    const arrHistorySearch = strHistorySearch.split('|');
    const configHistorySearch: Array<any> = [];
    arrHistorySearch.map((data, idx) => {
      if (data !== '') {
        configHistorySearch.push({
          state: data,
          idx: idx,
        });
      }
    });
    return configHistorySearch;
  }
  SaveHistorySearch(strSearch: string) {
    const configHistorySearch: Array<any> = this.GetHistorySearch();
    let found: Boolean = false;
    for (let i = 0; i < configHistorySearch.length; i++) {
      if (configHistorySearch[i]['state'].toString().toUpperCase() === strSearch.toUpperCase() || strSearch.length === 0) {
        found = true;
        break;
      }
    }

    if (!found && configHistorySearch.length >= 50) {
      configHistorySearch.shift();
    }

    if (!found) {
      let strHistorySearch = '|';
      configHistorySearch.map(search => {
        strHistorySearch += search['state'] + '|';
      });
      strHistorySearch += strSearch;
      localStorage.setItem('historySearchVU', strHistorySearch);
    }

  }
}

export interface QueryParameter {
  layer: string;
  queryParam: string;
  found: Boolean;
}
