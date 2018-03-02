import { Component, OnInit } from '@angular/core';
import {Estate3dService} from '../../services/estate3d.service';
import {Http} from '@angular/http';

@Component({
  selector: 'sic-estate-viewfloor',
  templateUrl: './estate-viewfloor.component.html',
  styleUrls: ['./estate-viewfloor.component.scss']
})
export class EstateViewfloorComponent implements OnInit {

  show3D = false;
  clave;

  pdfSrc = 'assets/blank.pdf';

  niveles = [];

  constructor(private http: Http, private estate3d: Estate3dService) { }

  ngOnInit() {
    this.estate3d.newFloorEstate$.subscribe(clave => {
      if (!!clave) {
        console.log(`FloorView for ${clave}`);
        this.loadPlanos(clave);
      }
    });
  }

  close() {
    console.log('closing');
    this.show3D = false;
    this.pdfSrc = 'assets/blank.pdf';
  }

  showPlano(nivel) {
    this.pdfSrc = `assets/${nivel.clave}/${nivel.clave}-${nivel.subfijo}.pdf`;
  }

  private loadPlanos(clave) {
    this.http.get(`assets/${clave}/index.json`).map(resp => resp.json().planos)
      .subscribe(planos => {
        this.niveles = planos;
        this.show3D = true;
        setTimeout(() => {
          this.pdfSrc = 'assets/D65J2707012/index.pdf';
        }, 250);
      }, error => {
        console.log('Estate FloorView Error', error);
        this.show3D = false;
        this.pdfSrc = 'assets/blank.pdf';
        alert('Vista Planta no disponible');
      });
  }
}
