import { TestBed, inject } from '@angular/core/testing';

import { EstateService } from './estate.service';

describe('EstateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EstateService]
    });
  });

  it('should be created', inject([EstateService], (service: EstateService) => {
    expect(service).toBeTruthy();
  }));
});
