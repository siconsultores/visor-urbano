import { Injectable } from '@angular/core';
import { Map } from 'openlayers';
import * as cuid from 'cuid';
import { layer, Overlay, interaction } from 'openlayers';

export enum MapEventType {
  CHANGE,
  CHANGE_LAYERGROUP,
  CHANGE_SIZE,
  CHANGE_TARGET,
  CHANGE_VIEW,
  CLICK,
  DOUBLECLICK,
  MOVEEND,
  POINTERDRAG,
  POINTERMOVE,
  POSTCOMPOSE,
  POSTRENDER,
  PRECOMPOSE,
  PROPERTYCHANGE,
  SINGLECLICK
}

const MapEvents: string[] = [
  'change',
  'change:layerGroup',
  'change:size',
  'change:target',
  'change:view',
  'click',
  'dblclick',
  'moveend',
  'pointerdrag',
  'pointermove',
  'postcompose',
  'postrender',
  'precompose',
  'propertychange',
  'singleclick'
];

@Injectable()
export class MapService {
  __map: Map;
  private eventHandlers: any = {};
  private layers: any[] = [];

  constructor() {
    const self = this;
    MapEvents.forEach(x => {
      self.eventHandlers[x] = [];
    });
  }

  createMap(options: any): Map {
    const self = this;
    try {
      self.__map = new Map(options);
      self.__map.on(MapEvents, (evt) => {
        !!self.eventHandlers[evt.type]
        && self.eventHandlers[evt.type].some(x => x.priority)
          ? self.eventHandlers[evt.type].filter(x => x.priority).forEach(x => { x.fn(evt); })
          : self.eventHandlers[evt.type].forEach(x => { x.fn(evt); });
      });

      return self.__map;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  addEventHandler(event: string, handler: (...args: any[]) => void, priority = false): string {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    const key = event + '.' + cuid();
    const eventHandler = {
      key: key,
      priority: priority,
      fn: handler
    };

    this.eventHandlers[event] = [...this.eventHandlers[event], eventHandler];

    return key;
  }

  removeEventHandler(id: string) {
    const evtType = id.split('.')[0];
    const idx = this.eventHandlers[evtType].reduce((a, b, i) => (b.key === id ? i : a), -1);

    if (idx === -1) {
      return;
    }

    this.eventHandlers[evtType] = [
      ...this.eventHandlers[evtType].slice(0, idx),
      ...this.eventHandlers[evtType].slice(idx + 1)
    ];
  }

  cleanLayers() {
    if (!!this.__map) {
      const currLayer = this.__map.getLayers();
      if (!!currLayer) {
        currLayer.forEach((x, i) => this.__map.removeLayer(x));
      }
    }
  }

  addLayer(newlayer: any) {
    if (!!this.__map) {
      newlayer.setMap(this.__map);
      // this.__map.addLayer(newlayer);
    }
  }

  removeLayer(currentLayer: any) {
    if (!!this.__map) {
      this.__map.removeLayer(currentLayer);
    }
  }

  addLayer2(customLayer: any) {
    if (!!this.__map) {
      this.__map.addLayer(customLayer.layer);
      this.layers = [...this.layers, customLayer];
      return this.layers.length - 1;
    } else {
      return null;
    }
  }

  addOverlay(popupOverlay: Overlay) {
    if (!!this.__map) {
      this.__map.addOverlay(popupOverlay);
    }
  }

  removeOverlay(popupOverlay: Overlay) {
    if (!!this.__map) {
      this.__map.removeOverlay(popupOverlay);
    }
  }

  getView() {
    if (!!this.__map) {
      return this.__map.getView();
    }
  }

  getOverlays() {
    if (!!this.__map) {
      return this.__map.getOverlays();
    }
  }
   // INTERACTIONS
  addInteraction(inter: interaction.Interaction) {
    if (this.__map) {
      this.__map.addInteraction(inter);
    }
  }

  removeInteraction(inter: interaction.Interaction) {
    if (this.__map) {
      this.__map.removeInteraction(inter);
    }
  }
}

