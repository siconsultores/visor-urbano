import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateSelectorComponent } from './estate-selector.component';

describe('EstateSelectorComponent', () => {
  let component: EstateSelectorComponent;
  let fixture: ComponentFixture<EstateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
