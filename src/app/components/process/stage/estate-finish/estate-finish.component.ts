import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../../common/constants';
import { ProcessService } from '../../process.service';

@Component({
  selector: 'sic-estate-finish',
  templateUrl: './estate-finish.component.html',
  styleUrls: ['./estate-finish.component.scss']
})
export class EstateFinishComponent implements OnInit {

  constructor(private ps: ProcessService) { }

  expediente: string;
  applicationStatus: string;
  applicationText: string;

  async ngOnInit() {
    this.applicationStatus = 'RECIBIDA';
    this.applicationText = 'Solicitud recibida';

    const estateData = {
      interesado: 'USUARIO VISOR URBANO',
      giro: this.ps.estateData.giro ,
      superficie: this.ps.estateData.surfaceBusinessLine,
      predio: {
        idpredio: this.ps.estateData.idpredio,
        clave: this.ps.estateData.cartografia.clave,
        geometry: this.ps.estateData.cartografia.poligono.geojson.geometry
      },
      sup_demolida: this.ps.estateData.removedBuildingSurface || 0,
      sup_edificada: this.ps.estateData.addedBuildingSurface || 0,
      sup_total: (
        this.ps.estateData.originalBuildingSurface
        - this.ps.estateData.removedBuildingSurface
        + this.ps.estateData.addedBuildingSurface) || 0
    };

    try {
      const respDictamination = await this.ps.postDictamination(estateData).toPromise();
      this.expediente = respDictamination.data.dictamen.folio;

      this.applicationStatus = respDictamination.data.dictamen.compatibilidad;

      switch (this.applicationStatus) {
        case 'PERMITIDO':
          this.applicationText = 'Solicitud permitida';
          break;
        case 'CONDICIONADO':
          this.applicationText = 'Solicitud condicionada';
          break;
        case 'PROHIBIDO':
          this.applicationText = 'Solicitud negada';
          break;
      }
      if (!!respDictamination.data.dictamen.dictamen) {
        window.open(`${Constants.BASE_URL}${respDictamination.data.dictamen.dictamen}`, '_blank');
      }
    } catch (e) {
      console.log(e);
      this.applicationStatus = 'PROHIBIDO';
      this.applicationText = 'Ocurrio un error al procesar tu solicitud';
    }
  }
  ReTramitar() {
    window.open(`https://visorurbano.com/nueva-licencia/${this.ps.estateData.cartografia.clave}`, '_blank');
  }

}
