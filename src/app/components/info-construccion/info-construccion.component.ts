import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {EstateService} from '../../services/estate.service';
import {Observable} from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'sic-info-construccion',
  templateUrl: './info-construccion.component.html',
  styleUrls: ['./info-construccion.component.scss']
})
export class InfoConstruccionComponent implements OnChanges {

  @Input('licencias') licencias = [];
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
