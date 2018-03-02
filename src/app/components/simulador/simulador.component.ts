import { Component, OnInit } from '@angular/core';
import {SidePanelContentComponent} from '../../services/side-panel.interface';
import {MapService} from '../../services/map.service';
import {Http} from '@angular/http';
import { layer, source, style, format } from 'openlayers';
import {Constants} from '../../common/constants';

@Component({
  selector: 'sic-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit, SidePanelContentComponent {

  giros = [];

  vectorLayer: layer.Vector;
  giroSeleccionado = null;

  constructor(private mapService: MapService, private http: Http) { }

  ngOnInit() {
  }

  search(searchTerm) {
    console.log(`Looking for: '${searchTerm}'`);
    this.http.get(`${Constants.API_URL}/licencias/giros/test/${searchTerm}`)
      .map(resp => resp.json())
      .subscribe(resp => {
        console.log(resp);
        this.giros = resp.data.giros;
      });
  }

  select(giro, distrito) {
    this.giroSeleccionado = giro;

    this.http.get(`${Constants.API_URL}/licencias/compatibilidad/distrito/${distrito}/zonas/${giro.codigo}`)
      .map(resp => resp.json())
      .subscribe(resp => {
        console.log(resp.data.zonas);
        this.highlightZonas(resp.data.zonas);
      });
  }

  highlightZonas({permitido, condicionado}) {
    if (!this.vectorLayer) {
      const vectorSource = new source.Vector();
      this.vectorLayer = new layer.Vector({
        source: vectorSource,
        style: new style.Style({
          stroke: new style.Stroke({
            color: 'rgba(0,104,55,.8)',
            width: 2
          }),
          fill: new style.Fill({
            color: 'rgba(157,190,21,0.6)',
          })
        })
      });
      this.mapService.addLayer(this.vectorLayer);
    }

    this.vectorLayer.getSource().clear();
    const featuresPermitido = new format.GeoJSON().readFeatures({type: 'FeatureCollection', features: permitido});
    let featuresCondicionado = new format.GeoJSON().readFeatures({type: 'FeatureCollection', features: condicionado});
    featuresCondicionado = featuresCondicionado.map(x => {
      x.setStyle(new style.Style({
        stroke: new style.Stroke({
          color: 'rgba(241,90,36,.8)',
          width: 2
        }),
        fill: new style.Fill({
          color: 'rgba(255,255,0,0.6)',
        })
      }));
      return x;
    });

    this.vectorLayer.getSource().addFeatures(featuresPermitido);
    this.vectorLayer.getSource().addFeatures(featuresCondicionado);

  }

  clearGiro() {
    this.vectorLayer.getSource().clear();
    this.giroSeleccionado = null;
  }

  hide(): void {
    console.log('Hidding Simulador');
    if (this.vectorLayer) {
      this.vectorLayer.getSource().clear();
      this.mapService.removeLayer(this.vectorLayer);
    }
  }

  show(): void {
    console.log('Showing Simulador');
  }

}
