import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import {proj, source, layer} from 'openlayers';

import 'rxjs/add/operator/map';

interface ILayer {
  title: string;
  opacity: number;
  visibility: number;
  selectable: boolean;
  symbology: string;
  type: string;
  extent: number[];
  source: any;
}

@Injectable()
export class LayerService {

  layers = [];
  layerListChange = new EventEmitter();

  constructor(private http: Http) { }

  loadLayers() {
    return this.http.get('/assets/layers.json').map(resp => {
      if (resp.ok) {
        // return resp.json().layers;

        this.layers = [...resp.json().layers.map(createLayer).filter(x => !!x.title)];
        this.layerListChange.emit(this.layers);
        return this.layers;

      } else {
        throw new Error(resp.statusText);
      }
    });
  }

  getLayers() {
    return this.layers;
  }
}

function createLayer(l): any {
  if (!!l['source']) {
    return {
      title: l['title'],
      active: false,
      source: new source[l['source']['type']]({
        url: l['source']['url'],
        params: Object.assign({}, l['source']['params']),
        serverType: l['source']['serverType'],
        projection: new proj.Projection(l['source']['projection'])
      }),
      layer: new layer[l['type']]({
        source: new source[l['source']['type']]({
          url: l['source']['url'],
          params: Object.assign({}, l['source']['params']),
          serverType: l['source']['serverType'],
          projection: new proj.Projection(l['source']['projection'])
        }),
        extent: layer['extent'],
        visible: l['visible'],
        opacity: l['opacity'],
      }),
      original: Object.assign({}, l),
    };
  } else { // Grupo
    const layers = [...l['layers'].map(createLayer)];
    return {
      title: l['title'],
      layers: layers,
      layer: new layer[l['type']]({
        layers: layers.map(lys => lys.layer),
        extent: layer['extent'],
        visible: l['visible'],
        opacity: l['opacity'],
      }),
      original: Object.assign({}, l),
    };
  }
}
