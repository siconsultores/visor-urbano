import { Component, OnInit } from '@angular/core';
import { ProcessService } from '../../process.service';

interface IComentario {
  nombre: string;
  correo: string;
  mensaje: string;
}

@Component({
  selector: 'sic-estate-details',
  templateUrl: './estate-details.component.html',
  styleUrls: ['./estate-details.component.scss']
})
export class EstateDetailsComponent implements OnInit {

  hayComentario1: boolean;
  comentario1: IComentario = {nombre: '', correo: '', mensaje: ''};
  comentarioEnviado = false;

  constructor(private ps: ProcessService) { }

  estateData: any;

  ngOnInit() {
    this.estateData = this.ps.estateData;
    console.log(this.estateData);
  }

  enviarObservacion(comentario) {
    console.log(comentario);

    this.ps.postComentario({clave: this.estateData.cartografia.clave, ...comentario}).subscribe(data => {
      this.comentarioEnviado = true;
    });
  }

}
