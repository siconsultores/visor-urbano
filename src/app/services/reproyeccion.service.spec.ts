import { TestBed, inject } from '@angular/core/testing';

import { ReproyeccionService } from './reproyeccion.service';

describe('ReproyeccionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReproyeccionService]
    });
  });

  it('should be created', inject([ReproyeccionService], (service: ReproyeccionService) => {
    expect(service).toBeTruthy();
  }));
});
