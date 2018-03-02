import {format, geom, Feature} from 'openlayers';
import {inside, explode, difference, union, centroid, intersect, buffer, bbox, bboxPolygon} from '@turf/turf';
import {ReproyeccionService, ProyeccionEnum} from '../services/reproyeccion.service';

export class Punto {

    private _x: number;
    private _y: number;
    private _geometria: geom.Point;
    private _feature: Feature;
    private _reproyeccion;

    constructor(x: number, y: number) {
      this._x = x;
      this._y = y;

      this._geometria = new geom.Point([this._x, this._y]);
      this._feature = new Feature(this._geometria);
      this._reproyeccion = new ReproyeccionService();
    }

    get X(): number {
      return this._x;
    }

    get Y(): number {
      return this._y;
    }

    get Feature(): Feature {
      return this._feature;
    }

    get GeoJSON(): any {
      return new format.GeoJSON().writeFeatureObject(this.Feature);
    }

    mover(anguloGrados: number, distancia: number): Punto {
      const anguloRadianes: number = anguloGrados * Math.PI / 180;
      const deltax = Math.cos(anguloRadianes) * distancia;
      const deltay = Math.sin(anguloRadianes) * distancia;

      return new Punto(this._x + deltax, this._y + deltay);
    }

    buffer(distancia: number): Poligono {
      const puntoLongLat = this.transformar(ProyeccionEnum.EPSG_6368, ProyeccionEnum.EPSG_4326);
      const buffered = buffer(puntoLongLat.GeoJSON, distancia, {units: 'meters'});

      const geometria = new geom.Polygon([buffered.geometry.coordinates[0] as any]);
      const feature = new Feature(geometria);
      const poligono = new format.GeoJSON().writeFeatureObject(feature);

      return new Poligono(poligono).transformar(ProyeccionEnum.EPSG_4326, ProyeccionEnum.EPSG_6368);
    }

    igual(punto: Punto): boolean {
      return this._x === punto._x && this._y === punto._y;
    }

    transformar(origen: ProyeccionEnum, destino: ProyeccionEnum): Punto {
      return this._reproyeccion.reproyectar(origen, destino, new Punto(this._x, this._y));
    }

    dentro(poligono: Poligono): boolean {
      return inside(this.GeoJSON, poligono.GeoJSON);
    }

  }

  export class Linea {

    private _inicio: Punto;
    private _fin: Punto;
    private _geometria: geom.LineString;
    private _feature: Feature;

    constructor(inicio: Punto, fin: Punto) {
      this._inicio = inicio;
      this._fin = fin;

      this._geometria = new geom.LineString([[inicio.X, inicio.Y], [fin.X, fin.Y]]);
      this._feature = new Feature(this._geometria);
    }

    get Feature(): Feature {
      return this._feature;
    }

    get GeoJSON(): any {
      return new format.GeoJSON().writeFeatureObject(this.Feature);
    }

    get Inicio(): Punto {
      return this._inicio;
    }

    get Fin(): Punto {
      return this._fin;
    }

    get PuntoMedio(): Punto {
      const medPointX = (this._inicio.X + this._fin.X) / 2;
      const medPointY = (this._inicio.Y + this._fin.Y) / 2;

      return new Punto(medPointX, medPointY);
    }

    get Longitud(): number {
      const powX = Math.pow(this._fin.X - this._inicio.X, 2);
      const powY = Math.pow(this._fin.Y - this._inicio.Y, 2);

      return Math.sqrt(powX + powY);
    }

    get Angulo(): number {
      const deltaX = this._fin.X - this._inicio.X;
      const deltaY = this._fin.Y - this._inicio.Y;
      const angulo = Math.atan2(deltaY, deltaX);

      return angulo;
    }

    get AnguloGrados(): number {
      return (this.Angulo > 0 ? this.Angulo : this.Angulo + 2 * Math.PI) * 180 / Math.PI;
    }

    get AnguloGradoSexagecimal(): string {
      const angulo = this.AnguloGrados;
      const grado = Math.floor(angulo);
      const minuto = Math.floor((angulo - grado) * 60);
      const segundo = (((angulo - grado) * 60 - minuto) * 60).toFixed(4);

      return '' + grado + '° ' + minuto + '\' ' + segundo + '"';
    }

    get Rumbo(): string {
      const deltaX = this._fin.X - this._inicio.X;
      const deltaY = this._fin.Y - this._inicio.Y;

      const angulo = Math.atan2(Math.abs(deltaX), Math.abs(deltaY)) * 180 / Math.PI;
      const grado = Math.floor(angulo);
      const minuto = Math.floor((angulo - grado) * 60);
      const segundo = (((angulo - grado) * 60 - minuto) * 60).toFixed(4);

      const sexagecimal = '' + grado + '° ' + minuto + '\' ' + segundo + '"';

      return (deltaY > 0 ? 'N ' : 'S ') + sexagecimal + (deltaX > 0 ? ' E' : ' O');
    }

    findParalela(lineas: Linea[], toleranciaGrados: number): Linea[] {
      let anguloNormalA: number;
      let anguloNormalB: number;

      const paralela = lineas.filter(item => {
        anguloNormalA = (Math.abs(this.AnguloGrados) >= 180) ? Math.abs(this.AnguloGrados) - 180 : Math.abs(this.AnguloGrados);
        anguloNormalB = (Math.abs(item.AnguloGrados) >= 180) ? Math.abs(item.AnguloGrados) - 180 : Math.abs(item.AnguloGrados);
        return Math.abs(anguloNormalA - anguloNormalB) <= toleranciaGrados;
      });

      return paralela;
    }

    getPuntoInterseccion(siguienteLinea: Linea): Punto {
      return new Util().puntoInterseccion(new Linea(this._inicio, this._fin), siguienteLinea);
    }

    contiguo(siguienteLinea: Linea): Boolean {
      let continuo: Boolean;
      if (this._fin.igual(siguienteLinea.Inicio)) {
        continuo = true;
      } else if (siguienteLinea.Fin.igual(this._inicio)) {
        continuo = true;
      } else {
        continuo = false;
      }

      return continuo;
    }

    buffer(distancia: number): Poligono {
      const inicio: Punto = this._inicio.transformar(ProyeccionEnum.EPSG_6368, ProyeccionEnum.EPSG_4326);
      const fin = this._fin.transformar(ProyeccionEnum.EPSG_6368, ProyeccionEnum.EPSG_4326);

      const lineaLongLat = new Linea(inicio, fin);

      const buffered = buffer(lineaLongLat.GeoJSON, distancia, {units: 'meters'});

      const geometria = new geom.Polygon([buffered.geometry.coordinates[0] as any]);
      const feature = new Feature(geometria);
      const poligono = new format.GeoJSON().writeFeatureObject(feature);

      return new Poligono(poligono).transformar(ProyeccionEnum.EPSG_4326, ProyeccionEnum.EPSG_6368);
    }

    getCota(tipo?: CotaTipo): Cota {
      let puntoCota: Punto;

      let angulo: number = this.Angulo;
      if (this.Angulo >= Math.PI / 2 && this.Angulo <= Math.PI) {
        angulo = this.Angulo + Math.PI;
      } else if (Math.abs(this.Angulo) >= Math.PI / 2 && Math.abs(this.Angulo) <= Math.PI) {
        angulo = this.Angulo + Math.PI;
      }

      if (tipo) {
        switch (tipo) {
          case CotaTipo.SobreLinea:
            puntoCota = this.PuntoMedio;
            break;
          case CotaTipo.Interna:
            puntoCota = this.PuntoMedio.mover(this.AnguloGrados - 90, 0.5);
            break;
          case CotaTipo.Externa:
            puntoCota = this.PuntoMedio.mover(this.AnguloGrados + 90, 0.5);
            break;
        }
      } else {
        puntoCota = this.PuntoMedio;
      }

      return new Cota(puntoCota, this.Longitud.toFixed(2).toString(), angulo * -1);
    }

  }

  export class Poligono {

    private _geometria: geom.Polygon;
    private _feature: Feature;
    private _reproyeccion;
    private _tipo: string;

    constructor(GeoJSON: any) {
      this._tipo = GeoJSON.geometry.type;
      this._geometria = (this._tipo === 'Polygon')
        ? new geom.Polygon(GeoJSON.geometry.coordinates)
        : new geom.Polygon(GeoJSON.geometry.coordinates[0]);
      this._feature = new Feature(this._geometria);
      this._reproyeccion = new ReproyeccionService();
      this._feature = new Feature(this._geometria);
    }

    get Feature(): Feature {
      return this._feature;
    }

    get GeoJSON(): any {
      return new format.GeoJSON().writeFeatureObject(this.Feature);
    }

    get Tipo(): string {
      return this._tipo;
    }

    get Area(): number {
      return this._geometria.getArea();
    }

    get Centroide(): Punto {
      const centroide = centroid(this.GeoJSON);
      return new Punto(centroide.geometry.coordinates[0], centroide.geometry.coordinates[1]);
    }

    getPuntos(): Punto[] {
      const explotado = explode(this.GeoJSON);
      const puntos: Punto[] = explotado.features.map((item, i) => {
        if (i < explotado.features.length - 1) {
          return new Punto(item.geometry.coordinates[0], item.geometry.coordinates[1]);
        }
      }).filter(item => item !== undefined);

      return puntos;
    }

    getLineas(): Linea[] {
      const lineas: Linea[] = [];
      const anillo = this.getPuntos();
      let inicio: Punto;
      let fin: Punto;

      for (let i = 0; i < anillo.length; i++) {
        if (i === anillo.length - 1) {
          inicio = new Punto(anillo[i].X, anillo[i].Y);
          fin = new Punto(anillo[0].X, anillo[0].Y);
          lineas.push(new Linea(inicio, fin));
        } else {
          inicio = new Punto(anillo[i].X, anillo[i].Y);
          fin = new Punto(anillo[i + 1].X, anillo[i + 1].Y);
          lineas.push(new Linea(inicio, fin));
        }
      }

      return lineas;
    }

    get Perimetro(): number {
      return this.getLineas()
        .reduce((prev, item) => prev + item.Longitud, 0);
    }

    fusionar(siguientePoligono: Poligono): Poligono {
      const unionPoligono = union(this.GeoJSON, siguientePoligono.GeoJSON);
      return new Poligono(unionPoligono);
    }

    simplificar(tolerancia: number): Poligono {

      const lineas: Linea[] = this.getLineas();
      const lineasSimplificadas: Linea[] = [lineas[0]];
      let idxUltimo: number;
      let anguloDiferencia: number;

      lineas.map((item, i) => {
        if (i > 0) {
          idxUltimo = lineasSimplificadas.length - 1;
          anguloDiferencia = Math.abs(lineasSimplificadas[idxUltimo].AnguloGrados - lineas[i].AnguloGrados);
          if (anguloDiferencia <= tolerancia) {
            lineasSimplificadas[idxUltimo] = new Linea(lineasSimplificadas[idxUltimo].Inicio, lineas[i].Fin);
          } else {
            lineasSimplificadas.push(lineas[i]);
          }
        }
      });

      anguloDiferencia = Math.abs(lineasSimplificadas[lineasSimplificadas.length - 1].AnguloGrados - lineasSimplificadas[0].AnguloGrados);
      if (anguloDiferencia <= tolerancia) {
        const primerItem = lineasSimplificadas.shift();
        idxUltimo = lineasSimplificadas.length - 1;
        lineasSimplificadas[lineasSimplificadas.length - 1] =
          new Linea(lineasSimplificadas[lineasSimplificadas.length - 1].Inicio, primerItem.Fin);
      }

      const coordenadasSimples = lineasSimplificadas.map(item => [item.Inicio.X, item.Inicio.Y]);
      coordenadasSimples.push([lineasSimplificadas[0].Inicio.X, lineasSimplificadas[0].Inicio.Y]);

      const geometriaSimple = new geom.Polygon([coordenadasSimples as any]);
      const featureSimple = new Feature(geometriaSimple);
      const poligonoSimple = new format.GeoJSON().writeFeatureObject(featureSimple);

      return new Poligono(poligonoSimple);
    }

    getPoligonoInterseccion(siguientePoligono: Poligono): Poligono {
      const poligonoInterseccion = intersect(this.GeoJSON, siguientePoligono.GeoJSON);
      return poligonoInterseccion ? new Poligono(poligonoInterseccion) : undefined;
    }

    transformar(origen: ProyeccionEnum, destino: ProyeccionEnum): Poligono {
      const self = this;
      const puntos = this.getPuntos().map(item => self._reproyeccion.reproyectar(origen, destino, new Punto(item.X, item.Y)));
      const coordenadas = puntos.map(item => [item.X, item.Y]);
      coordenadas.push([puntos[0].X, puntos[0].Y]);

      const geometria = new geom.Polygon([coordenadas as any]);
      const feature = new Feature(geometria);
      const poligonoGeoJSON = new format.GeoJSON().writeFeatureObject(feature);

      return new Poligono(poligonoGeoJSON);
    }

    buffer(distancia: number): Poligono {
      const puntos = this.getPuntos().map(item => item.transformar(ProyeccionEnum.EPSG_6368, ProyeccionEnum.EPSG_4326));
      const coordenadas: any = puntos.map(item => [item.X, item.Y]);
      coordenadas.push([puntos[0].X, puntos[0].Y]);

      const geometria = new geom.Polygon([coordenadas]);
      const feature = new Feature(geometria);
      const poligonoGeoJSON: any = new format.GeoJSON().writeFeatureObject(feature);

      const buffered = buffer(poligonoGeoJSON, distancia, {units: 'meters'});
      const poligono: Poligono = new Poligono(buffered).transformar(ProyeccionEnum.EPSG_4326, ProyeccionEnum.EPSG_6368);

      return poligono;
    }

    dividir(lineaGeoJSON: any): Poligono[] {
      let puntoAux: Punto;
      const coordinatesLongLat = lineaGeoJSON.geometry.coordinates.map(item => {
        puntoAux = new Punto(item[0], item[1]).transformar(ProyeccionEnum.EPSG_6368, ProyeccionEnum.EPSG_4326);
        return [puntoAux.X, puntoAux.Y];
      });

      const lineaGeoJSONLongLat: any = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinatesLongLat
        },
        properties: {}
      };

      const buffered = buffer(lineaGeoJSONLongLat, 0.0000001, {units: 'meters'});
      const navaja: Poligono = new Poligono(buffered).transformar(ProyeccionEnum.EPSG_4326, ProyeccionEnum.EPSG_6368);

      const diferencia: any = difference(this.GeoJSON, navaja.GeoJSON);

      const poligonos: Poligono[] = [];
      let polGeoJSON: any;
      diferencia.geometry.coordinates.map(coordGeoJSON => {
        polGeoJSON = {
          geometry: {
            coordinates: [coordGeoJSON]
          },
          type: 'Polygon'
        };

        poligonos.push(new Poligono(polGeoJSON));
      });

      return poligonos;
    }

    getCotas(tipo?: CotaTipo): Cota[] {
      return this.getLineas().map(linea => linea.getCota(tipo));
    }

    getCuadroConstruccion(): RenglonConstruccion[] {
      const lineas = this.getLineas();
      return lineas.map((linea, index) => {
        const puntoVisado = index + 2;
        return new RenglonConstruccion(index + 1, (puntoVisado > lineas.length) ? 1 : puntoVisado, linea);
      });
    }

  }

  export class RenglonConstruccion {
    private _estacion: number;
    private _puntoVisado: number;
    private _rumbo: string;
    private _longitud: number;
    private _vertice: number;
    private _punto: Punto;

    constructor(estacion: number, puntoVisado: number, linea: Linea) {
      this._estacion = estacion;
      this._puntoVisado = puntoVisado;
      this._rumbo = linea.Rumbo;
      this._longitud = linea.Longitud;
      this._vertice = estacion;
      this._punto = linea.Inicio;
    }

    get Estacion(): number {
      return this._estacion;
    }

    get PuntoVisado(): number {
      return this._puntoVisado;
    }

    get Rumbo(): string {
      return this._rumbo;
    }

    get Longitud(): number {
      return this._longitud;
    }

    get Vertice(): number {
      return this._vertice;
    }

    get Punto(): Punto {
      return this._punto;
    }
  }

  export enum CotaTipo {
    SobreLinea = 1,
    Externa = 2,
    Interna = 3
  }

  export class Cota {

    private _punto: Punto;
    private _texto: string;
    private _angulo: number;
    private _feature: Feature;

    constructor(punto: Punto, texto: string, angulo: number) {
      this._punto = punto;
      this._texto = texto;
      this._angulo = angulo;

      this._feature = new Feature({
        geometry: this._punto.Feature.getGeometry(),
        texto: this._texto,
        angulo: this._angulo
      });
    }

    get Punto(): Punto {
      return this._punto;
    }

    get Texto(): string {
      return this._texto;
    }

    get Angulo(): number {
      return this._angulo;
    }

    get AnguloGrados(): number {
      return this._angulo * 180 / Math.PI;
    }

    get Feature(): Feature {
      return this._feature;
    }

    get GeoJSON(): any {
      return new format.GeoJSON().writeFeatureObject(this.Feature);
    }

  }

  export class Util {
    constructor() {

    }

    getRadianesToGrados(radianes: number) {
      return (radianes * 180) / Math.PI;
    }

    getGradosToRadianes(grados: number) {
      return grados * (Math.PI / 180);
    }

    /*
    -------------------------------------------------------------
    ' Nombre del la Funcion      : leyCoseno
    ' Parametros                 : double Coordenada x1 - es la posición x del punto 1
    '                              double Coordenada y1 - es la posición y del punto 1
    '                              double Coordenada x2 - es la posición x del punto 2
    '                              double Coordenada y2 - es la posición y del punto 2
                     double Coordenada x3 - es la posición x del punto 3
                     double Coordenada y3 - es la posición y del punto 3
    ' Valor de Retorno           : double anguloGrado - Es el ángulo calculado en grados del punto 2
    ' Fecha Inicio Codificación  : 7 de Mayo del 2009
    ' Fecha Ultima Actualización : 11 de Mayo del 2009
    ' Fecha Prueba               : 8 de Mayo del 2009
    ' Codifico Inicialmente      : MARC - MEMA
    ' Actualizo                  : MARC - MEMA
    ' Probo                      : MARC - MEMA
    ' Descripción                : Esta función calcula calcula los grados de apertura
                                     entre las lineas formadas desde el punto 1 al punto 2 y del punt2 al punto 3
    '                              Utilizando el teorema de la ley de cosenos donde Angulo = cos^-1((a^2 + b^2 - c^2)/2ab)
    ' -------------------------------------------------------------
    */
    leyCoseno(p1: Punto, p2: Punto, p3: Punto) {
      let dAlfa = 0;
      let anguloGrado = 0;
      let ladoc = 0;
      let ladoa = 0;
      let ladob = 0;

      const ladoabase: number = (p2.X - p1.X);
      const ladoaaltura: number = (p2.Y - p1.Y);

      ladoa = Math.sqrt(Math.pow(ladoabase, 2) + Math.pow(ladoaaltura, 2));

      const ladobbase = (p3.X - p2.X);
      const ladobaltura = (p3.Y - p2.Y);
      ladob = Math.sqrt(Math.pow(ladobbase, 2.0) + Math.pow(ladobaltura, 2.0));

      const ladocbase = p3.X - p1.X;
      const ladocaltura = p3.Y - p1.Y;
      ladoc = Math.sqrt(Math.pow(ladocbase, 2.0) + Math.pow(ladocaltura, 2.0));
      const num = (Math.pow(ladoa, 2.0) + Math.pow(ladob, 2.0) - Math.pow(ladoc, 2.0));
      const den = (2 * ladoa * ladob);
      dAlfa = num / den;

      // double test = 0;
      // test = Math.Acos(dAlfa);
      if (dAlfa === 0) {
        anguloGrado = Math.PI / 2;
      } else if (dAlfa >= -1.000001 && dAlfa <= -0.999999) {
        anguloGrado = Math.PI;
      } else if (dAlfa === 1) {
        anguloGrado = Math.PI;
      } else {
        anguloGrado = Math.atan(-dAlfa / (Math.pow((-dAlfa * dAlfa + 1), .5))) + 2 * Math.atan(1);
      }
      anguloGrado = this.getRadianesToGrados(anguloGrado);
      return anguloGrado;
    }

    /*
    -------------------------------------------------------------
      ' Nombre del la Funcion      : pendiente
      ' Parametros                 : double Coordenada x1 - es la posición x del punto 1
                       double Coordenada y1 - es la posición y del punto 1
                       double Coordenada x2 - es la posición x del punto 2
                       double Coordenada y2 - es la posición y del punto 2
      ' Valor de Retorno           : double m - Obtiene el cambio de posición en Y por cada incremento o decremento de posición en x
      ' Fecha Inicio Codificación  : 7 de Mayo del 2009
      ' Fecha Ultima Actualización : 11 de Mayo del 2009
      ' Fecha Prueba               : 8 de Mayo del 2009
      ' Codifico Inicialmente      : MARC - MEMA
      ' Actualizo                  : MARC - MEMA
      ' Probo                      : MARC - MEMA
      ' Descripción                : Esta función calcula la razón de cambio entre dos puntos.
      ' -------------------------------------------------------------
    */
    getPendiente(p1: Punto, p2: Punto) {
      return (p2.Y - p1.Y) / (p2.X - p1.X);
    }

    /*
    -------------------------------------------------------------
    ' Nombre del la Funcion      : puntoInterseccion
    ' Parametros                 : double Coordenada Px1 - es la posición x1 de la recta 1
                     double Coordenada Py1 - es la posición y1 de la recta 1
                     double Coordenada Px2 - es la posición x2 de la recta 1
                     double Coordenada Py2 - es la posición y2 de la recta 1
                     double Coordenada Lx1 - es la posición x1 de la recta 2
                     double Coordenada Ly1 - es la posición y1 de la recta 2
                     double Coordenada Lx2 - es la posición x2 de la recta 2
                     double Coordenada Ly2 - es la posición y2 de la recta 2
    ' Valor de Retorno           : double[] interseccion - Es el punto expresado en X y Y
                                     de la intersección de las dos rectas en el espacio
    '                              Nota: si regresa X = 0 y Y = 0 quiere decir que las rectas son paralelas
                                     y nunca se chocan entre si en el espacio cartesiano
    ' Fecha Inicio Codificación  : 7 de Mayo del 2009
    ' Fecha Ultima Actualización : 11 de Mayo del 2009
    ' Fecha Prueba               : 8 de Mayo del 2009
    ' Codifico Inicialmente      : MARC
    ' Actualizo                  : MARC
    ' Probo                      : MARC
    ' Descripción                : Esta función calcula el punto de intersección en el espacio cartesiano
                                     entre dos rectas utilizando el principio de la obtención de dos funciones
    '                              paramétricas para posteriormente con el método de sustitución obtener la X y Y correspondientes
                                     al punto de interés.
    ' -------------------------------------------------------------
    */
    puntoInterseccion(line1: Linea, line2: Linea) {
      let interseccion: Punto;

      const m1: number = this.getPendiente(line1.Inicio, line1.Fin);
      const m2: number = this.getPendiente(line2.Inicio, line2.Fin);
      // Las rectas son paralelas
      if (m1 === m2) {
        return null;
      }

      let vx1, vy1, vi1, vx2, vy2, vi2;

      vx1 = (line1.Fin.Y - line1.Inicio.Y);
      vy1 = -((line1.Fin.X - line1.Inicio.X));
      vi1 = ((line1.Fin.Y - line1.Inicio.Y) * (-line1.Inicio.X)) - ((line1.Fin.X - line1.Inicio.X) * (-line1.Inicio.Y));

      vx2 = (line2.Fin.Y - line2.Inicio.Y);
      vy2 = -((line2.Fin.X - line2.Inicio.X));
      vi2 = ((line2.Fin.Y - line2.Inicio.Y) * (-line2.Inicio.X)) - ((line2.Fin.X - line2.Inicio.X) * (-line2.Inicio.Y));

      const x = (-(vy2 * vi1) + (vy1 * vi2)) / ((vy2 * vx1) + (vy1 * -vx2));
      const y = (-(vi2) - (vx2 * x)) / vy2;
      interseccion = new Punto(x, y);
      return interseccion;
    }

  }
