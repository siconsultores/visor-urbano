import { Component, OnInit } from '@angular/core';
import { SidePanelContentComponent } from '../../services/side-panel.interface';
import { SidePanelService } from '../../services/side-panel.service';
import { EstateService } from '../../services/estate.service';
import { BusinessComponent } from '../process/business/business.component';
import { BuildingComponent } from '../process/building/building.component';
import {geom} from 'openlayers';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'sic-estate-detail',
  templateUrl: './estate-detail.component.html',
  styleUrls: ['./estate-detail.component.scss']
})
export class EstateDetailComponent implements OnInit, SidePanelContentComponent {

  predio;
  claveZonificacion = '';

  adeudo = false;

  licenciasPredio = [];
  licenciasConstruccionPredio = [];

  detallesPredio: {
    field: string;
    value: string;
  }[] = [];

  constructor(private sidePanelService: SidePanelService, private estateService: EstateService, private mapService: MapService) {
    this.predio = this.estateService.getActiveEstate();
    this.adeudo = this.predio.adeudo.saldoTotal > 0;
    console.log(this.predio);

  }

  ngOnInit() {
    if (this.predio.cartografia.poligono) {
      this.estateService.postZonificacion(this.predio.cartografia.poligono.geojson.geometry).subscribe(resp => {
        if (resp.data.zonificacion.length > 0) {
          this.claveZonificacion = resp.data.zonificacion[0].clave;
        }
        this.loadDetail();
      });
    } else {
      this.loadDetail();
    }
  }

  loadDetail() {
    if (!!this.predio) {
      this.detallesPredio = [
        {
          field: 'Dirección',
          value: `${this.predio.calle} ${this.predio.numeroExterior}`
        },
        {
          field: 'Clave Catastral',
          value: `${this.predio.cartografia.clave}`
        },
        {
          field: 'Superficie Terreno',
          value: `Escritura: ${!!this.predio.areaTitulo ? this.predio.areaTitulo + ' m2' : 'Dato no disponible'}`
        },
        {
          field: 'Superficie Terreno',
          value: `Cartografía: ${!!this.predio.cartografia.poligono.area
            ? Math.round(this.predio.cartografia.poligono.area * 100) / 100 + ' m2'
            : 'Dato no disponible'}`
        },
        {
          field: 'Superficie Construida',
          value: `${!!this.predio.avaluo.areaConstruccionAvaluo
            ? this.predio.avaluo.areaConstruccionAvaluo + ' m2'
            : 'Dato no disponible'}`
        },
        {
          field: 'Frente de Predio',
          value: `${!!this.predio.avaluo.frente ? this.predio.avaluo.frente + ' m' : 'Dato no disponible'}`
        },
        {
          field: 'Zonificacion',
          value: `${this.claveZonificacion}`
        },
      ];

      this.mapService.getView().fit(
        new geom.Polygon(this.predio.cartografia.poligono.geojson.geometry.coordinates).getExtent()
      );
    }
  }

  iniciarTramite(tramite) {
    if (tramite === 'negocio') {
      this.tramitarNegocio();
    } else if (tramite === 'construccion') {
      this.tramitarConstruccion();
    }
  }

  private tramitarNegocio() {
    // this.sidePanelService.open();
    console.log('Tramitar Negocio');
    // this.sidePanelService.open(DictamenNegocioComponent as any, { title: 'Abrir Negocio', headerSize: 'small' });
    this.sidePanelService.open(BusinessComponent as any, { title: 'Abrir Negocio', headerSize: 'small' });
  }

  private tramitarConstruccion() {
    console.log('Tramitar construccion');
    // window.open('https://servicios.guadalajara.gob.mx/registro_ciudadano/users/sign_in', '_blank');
    this.sidePanelService.open(BuildingComponent as any, { title: 'Quiero construir', headerSize: 'small' });
  }

  hide(): void {
    console.log('Hidding Predio Detalle');
  }

  show(): void {
    console.log('Showing Predio Detalle');
    this.predio = this.estateService.getActiveEstate();
    this.adeudo = this.predio.adeudo.saldoTotal > 0;
    const licencia$ = this.estateService.getLicenciasActiveEstate();
    if (licencia$) {
      licencia$.subscribe(data => {
        if (data) {
          this.licenciasPredio = data;
        } else {
          this.licenciasPredio = [];
        }
      });
    } else {
      this.licenciasPredio = [];
    }

    const licenciac$ = this.estateService.getLicenciasConstruccionActiveEstate();
    if (licenciac$) {
      licenciac$.subscribe(data => {
        if (data) {
          this.licenciasConstruccionPredio = data;
        } else {
          this.licenciasConstruccionPredio = [];
        }
      });
    } else {
      this.licenciasConstruccionPredio = [];
    }

    if (this.predio.cartografia.poligono) {
      this.estateService.postZonificacion(this.predio.cartografia.poligono.geojson.geometry).subscribe(resp => {
        if (resp.data.zonificacion.length > 0) {
          this.claveZonificacion = resp.data.zonificacion[0].clave;
        }
        this.loadDetail();
      });
    } else {
      this.loadDetail();
    }
  }
}
