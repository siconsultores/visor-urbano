import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProcessService } from '../../process.service';
import { Constants } from '../../../../common/constants';

@Component({
  selector: 'sic-business-line',
  templateUrl: './business-line.component.html',
  styleUrls: ['./business-line.component.scss']
})
export class BusinessLineComponent implements OnInit {

  constructor(
    private http: Http,
    private ps: ProcessService
  ) { }

  businessLines: any;
  selectedBusinessLine: any;
  value: string;

  ngOnInit() {
    if (this.ps.estateData.surfaceType === 1) {
      this.ps.estateData.surfaceBusinessLine = this.ps.estateData.cartografia.poligono.area.toFixed(3);
    }
  }

  search(searchTerm) {
    console.log(`Looking for: '${searchTerm}'`);
    this.http.get(`${Constants.API_URL}/licencias/giros/test/${searchTerm}`)
      .map(resp => resp.json())
      .subscribe(resp => {
        this.businessLines = resp.data.giros;
      });
  }

  selectBusinessLine(businessLine: any) {
    this.ps.setBusinessLine(businessLine.codigo);

    this.selectedBusinessLine = businessLine;
    this.value = businessLine.nombre;
    this.businessLines = undefined;
  }

}
