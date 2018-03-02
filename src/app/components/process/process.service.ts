import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Constants } from '../../common/constants';

@Injectable()
export class ProcessService {

  constructor(private http: Http) { }

  estateData: any;
  private tramite: string;

  getData(code: string) {
    return this.http.get(`${Constants.API_URL}/catastro/predio/vu?clave=${code}`).map(data => data.json());
  }

  setData(data: any) {
    this.estateData = data;
  }

  setTramite(tramite) {
    this.tramite = tramite;
  }

  setBuildingLine(buildingLine: any) {
    this.estateData.construccion = buildingLine;
  }

  setBusinessLine(businessLine: any) {
    this.estateData.giro = businessLine;
  }

  postDictamination(estateData: any) {
    return this.http.post(`${Constants.API_URL}/tramite/dictamen/${this.tramite}`, estateData).map(data => data.json());
  }

  getConstructionPlan(clave: string) {
    return this.http.get(`${Constants.API_URL}/tramite/plano/${clave}`);
  }

  postComentario(datos) {
    return this.http.post(`${Constants.API_URL}/notificacion/comentario`, datos).map(data => data.json());
  }
}
