import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MapService } from '../../../services/map.service';
import { Overlay } from 'openlayers';

@Component({
  selector: 'sic-identify-result',
  templateUrl: './identify-result.component.html',
  styleUrls: ['./identify-result.component.scss']
})
export class IdentifyResultComponent implements OnInit, OnChanges {

  @Input('services') services;
  @Input('position') position;

  @Output('onClose') onClose = new EventEmitter();

  popupOverlay: Overlay;

  servicess = [
    {
      name: 'Catastro',
      layers: [
        {
          name: 'Predio',
          properties: [
            {key: 'clave', value: 'D65J2200010000'},
            {key: 'predio', value: '00001'},
            {key: 'manzana', value: '200'},
          ]
        },
        {
          name: 'Construcción',
          properties: [
            {key: 'nivel', value: '2'},
            {key: 'clasificación', value: '2:2030'},
            {key: 'edad', value: '5'},
          ]
        },
        {
          name: 'Construcción',
          properties: [
            {key: 'nivel', value: '1'},
            {key: 'clasificación', value: '1:0020'},
            {key: 'edad', value: '50'},
          ]
        },
      ]
    },
    {
      name: 'Patrimonio INAH',
      layers: [
        {
          name: 'Patrimonio INAH',
          properties: [
            {key: 'folio', value: 150698},
            {key: 'nombre', value: 'Museo interactivo "José Reyes Mata"'},
            {key: 'ubicación', value: 'Paseo Jacaranda 1357, Col. Verde Valle'}
          ]
        }
      ]
    }
  ];

  constructor(private mapService: MapService, private elementRef: ElementRef) { }

  ngOnInit() {
    this.popupOverlay = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Identify Overlay Change', changes);
    if (Object.entries(changes).some(([key, val]) => ['position'].indexOf(key) !== -1 )) {
      console.log('showing overlay...');
      this.showOverlay();
    }
  }

  showOverlay() {
    if (!!this.popupOverlay) {
      this.popupOverlay.setPosition(this.position);
    } else {
      this.popupOverlay = new Overlay({
        element: this.elementRef.nativeElement,
        position: this.position,
        autoPan: true,
        autoPanAnimation: {
          source: this.position
        }
      });
      this.mapService.addOverlay(this.popupOverlay);
      console.log('showing overlay...', this.popupOverlay);
    }
  }

  closeOverlay() {
    this.mapService.removeOverlay(this.popupOverlay);
    this.popupOverlay = null;
    this.onClose.emit();
  }

}
