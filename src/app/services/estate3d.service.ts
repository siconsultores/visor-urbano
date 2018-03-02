import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class Estate3dService {

  estate3d;

  newEstate$ = new BehaviorSubject<any>(null);
  newFloorEstate$ = new BehaviorSubject<any>(null);

  constructor(private http: Http) { }

  load3dEstate(clave) {
    /*
    this.http.get(`/assets/${clave}.json`).subscribe(res => {
      this.estate3d = res.json();
      this.newEstate$.next(this.estate3d);
    });
    */
    console.log(`loading 3d for ${clave}`);

    this.newEstate$.next(clave);
  }

  loadestateFloorView(clave) {
    console.log(`loading floor view for ${clave}`);

    this.newFloorEstate$.next(clave);
  }

}
