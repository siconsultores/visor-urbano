import { Injectable } from '@angular/core';
import { Punto } from '../common/geometria';
import * as proj4 from 'proj4';
@Injectable()
export class ReproyeccionService {

  constructor() { }
  private getProyeccionString(proyeccion: ProyeccionEnum): string {
    switch (proyeccion) {
        case ProyeccionEnum.Leaflet:
            return '+proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs';
        case ProyeccionEnum.EPSG_3857:
            return '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 '
                + '+x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs';
        case ProyeccionEnum.EPSG_4326:
            return '+proj=longlat +datum=WGS84 +no_defs';
        case ProyeccionEnum.EPSG_6368:
            return '+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
        case ProyeccionEnum.EPSG_32613:
            return '+proj=utm +zone=13 +datum=WGS84 +units=m +no_defs';
    }
}

  reproyectar(origen: ProyeccionEnum, destino: ProyeccionEnum, punto: Punto): Punto {
    const reproyectado = proj4(this.getProyeccionString(origen), this.getProyeccionString(destino), [punto.X, punto.Y]);
    return new Punto(reproyectado[0], reproyectado[1]);
  }
}

export enum ProyeccionEnum {
  Leaflet = 1,
  EPSG_3857 = 2,
  EPSG_4326 = 3,
  EPSG_6368 = 4,
  EPSG_32613 = 5
}

