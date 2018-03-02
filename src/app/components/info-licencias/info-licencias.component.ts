import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {EstateService} from '../../services/estate.service';
// import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'sic-info-licencias',
  templateUrl: './info-licencias.component.html',
  styleUrls: ['./info-licencias.component.scss']
})
export class InfoLicenciasComponent implements OnInit, OnChanges {

  @Input('licencias') licencias = [
    {
      licencia: 123456,
      fecha_otorgamiento: '15/06/2014',
      actividad: 'FARMACIA'
    },
    {
      licencia: 123457,
      fecha_otorgamiento: '19/06/2010',
      actividad: 'VENTA PRODUCTOS NATURISTAS'
    },
    {
      licencia: 123458,
      fecha_otorgamiento: '25/08/2013',
      actividad: 'CONSULTORIO MEDICO'
    },
    {
      licencia: 123459,
      fecha_otorgamiento: '15/08/2010',
      actividad: 'CONSULTORIO DENTAL'
    },
  ];
  licenciasDS;

  constructor(private estateService: EstateService) {
    /*
    const lic = this.estateService.getLicenciasActiveEstate();
    if (lic) {
      lic.subscribe(data => {
        console.log('Lic Active', data);
      });
    }*/
    this.licenciasDS = new ExampleDataSource(this.licencias);
  }

  ngOnChanges(changes: SimpleChanges) {
    const licencias: SimpleChange = changes.licencias;
    console.log('prev value: ', licencias.previousValue);
    console.log('got licencias: ', licencias.currentValue);
    this.licenciasDS = new ExampleDataSource(this.licencias);
  }

  ngOnInit() {
  }

}

class ExampleDataSource extends DataSource<any> {
  data;
  constructor(data: any[]) {
    super();
    this.data = data;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return Observable.of(this.data);
  }

  disconnect() {}
}
