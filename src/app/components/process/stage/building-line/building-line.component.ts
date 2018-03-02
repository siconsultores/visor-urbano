import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ProcessService } from '../../process.service';
import { Constants } from '../../../../common/constants';

@Component({
  selector: 'sic-building-line',
  templateUrl: './building-line.component.html',
  styleUrls: ['./building-line.component.scss']
})
export class BuildingLineComponent implements OnInit {

  constructor(
    private http: Http,
    private ps: ProcessService
  ) { }

  businessLines: any;
  selectedBusinessLine: any;
  value: string;

  usos = [
    {
      clave: 'H',
      uso: 'Habitacional'
    },
    {
      clave: 'CS',
      uso: 'Comercio y servicio'
    },
    {
      clave: 'I',
      uso: 'Industrial'
    },
    {
      clave: 'E',
      uso: 'Equipamiento'
    },
  ];

  ngOnInit() {
    this.ps.estateData.originalBuildingSurface = this.ps.estateData.avaluo.areaConstruccionAvaluo;
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
    console.log('Ya algo se hizo', businessLine);
    this.ps.setBusinessLine(businessLine);
  }

}
