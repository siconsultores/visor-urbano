import { TestBed, inject } from '@angular/core/testing';

import { Estate3dService } from './estate3d.service';

describe('Estate3dService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Estate3dService]
    });
  });

  it('should be created', inject([Estate3dService], (service: Estate3dService) => {
    expect(service).toBeTruthy();
  }));
});
