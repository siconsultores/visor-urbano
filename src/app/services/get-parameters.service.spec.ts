import { TestBed, inject } from '@angular/core/testing';

import { GetParametersService } from './get-parameters.service';

describe('GetParametersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetParametersService]
    });
  });

  it('should be created', inject([GetParametersService], (service: GetParametersService) => {
    expect(service).toBeTruthy();
  }));
});
