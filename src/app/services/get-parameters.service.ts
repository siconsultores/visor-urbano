import { Injectable, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GetParametersService {
  @Output() doQueryEmbebido = new EventEmitter();
  constructor(private activatedRoute: ActivatedRoute) {

  }
  readCriterioParams() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
      const criterio = params['criterio'];
      if (criterio !== undefined) {
        this.doQueryEmbebido.emit(criterio);
      }
    });
  }
}
