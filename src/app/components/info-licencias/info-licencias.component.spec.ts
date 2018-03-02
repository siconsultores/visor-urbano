import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLicenciasComponent } from './info-licencias.component';

describe('InfoLicenciasComponent', () => {
  let component: InfoLicenciasComponent;
  let fixture: ComponentFixture<InfoLicenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoLicenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoLicenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
