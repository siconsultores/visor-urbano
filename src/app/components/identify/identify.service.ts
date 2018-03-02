import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class IdentifyService {

  identifyChange$ = new BehaviorSubject<any>(false);

  constructor() { }

  startIdentify() {
    this.identifyChange$.next(true);
  }

  stopIdentify() {
    this.identifyChange$.next(false);
  }

}
