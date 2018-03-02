import { TestBed, inject } from '@angular/core/testing';

import { SidePanelService } from './side-panel.service';

describe('SidePanelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidePanelService]
    });
  });

  it('should be created', inject([SidePanelService], (service: SidePanelService) => {
    expect(service).toBeTruthy();
  }));
});
