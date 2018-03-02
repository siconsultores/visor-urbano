import {Component, HostBinding, OnInit} from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { MapService } from '../../services/map.service';
import { SearchService } from '../../services/search.service';
import {EstateService} from '../../services/estate.service';
import {SidePanelService} from '../../services/side-panel.service';
import {EstateDetailComponent} from '../estate-detail/estate-detail.component';
import {Feature, geom, layer, source, style as olStyle} from 'openlayers';
import {Estate3dService} from '../../services/estate3d.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'sic-estate-selector',
  templateUrl: './estate-selector.component.html',
  styleUrls: ['./estate-selector.component.scss'],
  animations: [
    trigger('toggleBottomSheet', [
      state('open', style({ display: 'flex', height: '143px' })),
      state('close', style({ display: 'none', height: '0px' })),
      // transition('open <=> close', animate('100ms ease-in')),
      transition('open => close',
        animate('100ms ease-in', style({height: '0px'}))
      ),
      transition('close => open',
        animate('150ms ease-in', style({height: '143px'}))
      ),
    ]),
  ]
})
export class EstateSelectorComponent implements OnInit {

  @HostBinding('@toggleBottomSheet') state: 'open'|'close' = 'close';
  selectedPredio = null;
  vinculado = true;

  eventId: string;

  tools = [
    {
      icon: 'visibility_on',
      label: 'Detalle',
      tooltip: 'Detalle',
      action: () => {
        this.estateService.setActive(this.selectedPredio);
        this.panelService.open(EstateDetailComponent as any, {
          title: 'Detalle del Predio',
          headerSize: 'small'
        });
      },
      disabled: false
    },
    {
      icon: '3d_rotation',
      label: 'Vista 3D',
      tooltip: 'Vista 3D',
      action: () => {
        if (this.selectedPredio) {
          this.estate3dService.load3dEstate(this.selectedPredio.claveCatastral);
        }
      },
      disabled: true
    },
    {
      icon: 'report_problem',
      label: 'Reportar',
      tooltip: 'Reporte',
      action: () => {
        window.open('https://mapa.mejoratuciudad.org/mx.guadalajara', '_blank');
      },
      disabled: false
    },
  ];

  ubicacion = 'Domicilio';
  colonia = 'Colonia';
  clave = 'Clave';

  vectorSourceEstate;
  vectorLayerEstate;


  constructor(private mapService: MapService,
              private estateService: EstateService,
              private searchService: SearchService,
              private estate3dService: Estate3dService,
              private panelService: SidePanelService,
              private dialog: MatDialog) { }

  ngOnInit() {

    this.vectorSourceEstate = new source.Vector({});

    this.eventId = this.mapService.addEventHandler('singleclick', (evt) => {
      this.searchService.ClearVectorLayer();
      console.log('Seleccioname un predio', evt);
      this.ubicacion = 'Domicilio';
      this.colonia = 'Colonia';
      this.clave = 'Clave';
      this.vinculado = true;
      this.estateService.getPredioAtPoint(evt.coordinate[0], evt.coordinate[1]).subscribe(predio => {
        console.log('Getting predio: ', predio);

        this.vectorSourceEstate.clear();
        if (!this.vectorLayerEstate) {
          this.vectorLayerEstate = new layer.Vector({
            source: this.vectorSourceEstate,
            style: new olStyle.Style({
              stroke: new olStyle.Stroke({
                color: 'rgba(255,152,0,1)',
                width: 2
              }),
              fill: new olStyle.Fill({
                color: 'rgba(255,152,0,0.6)'
              })
            })
          });

          this.mapService.addLayer(this.vectorLayerEstate );
        }

        const estatePolygon = new geom.Polygon(predio.geometry.coordinates);
        const estateFeature = new Feature(estatePolygon);
        this.vectorSourceEstate.addFeature(estateFeature);
        this.vectorLayerEstate.setZIndex(500);

        if ( predio.caso === 3
             || (predio.CONDOMIONIO === 1 && predio.unidad === '0000')
             || predio.CLAVEGDL.length !== 14) {
          this.vinculado = false;
          this.tools = this.tools.map((t) => {
            t.disabled = true;
            return t;
          });
          this.state = 'open';
          return;
        }

        this.estateService.getPredioByClave(predio.CLAVEGDL).subscribe( predioPadron => {
          this.selectedPredio = predioPadron;
          this.state = 'open';
          this.clave = predio.CLAVEGDL;
          this.colonia = predioPadron.colonia;
          this.ubicacion = `${predioPadron.calle} ${predioPadron.numeroExterior}`;

          this.estateService.setActive(this.selectedPredio);
          this.panelService.reopen(EstateDetailComponent as any, {
            title: 'Detalle del Predio',
            headerSize: 'small'
          });

          this.tools = this.tools.map((t, idx) => {
            if (idx === 0) { t.disabled = false; }
            if (idx === 1) {
              if (this.selectedPredio.cartografia.condominio === 1) {
                t.disabled = false;
              } else {
                t.disabled = true;
              }
            }
            return t;
          });
        }, error => {
          this.vinculado = false;
          console.log('Ocurrio error de padron', error);
          this.close();
        });
      }, error => {
        this.vinculado = false;
        console.log('Ocurrio error de cartografia', error);
        this.close();
      });
    });
  }

  close() {
    this.selectedPredio = null;
    this.state = 'close';
    this.ubicacion = 'Domicilio';
    this.colonia = 'Colonia';
    this.clave = 'Clave';
    this.vectorSourceEstate.clear();
  }

}
