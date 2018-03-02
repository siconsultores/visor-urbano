import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateBuildingComponent } from './estate-building.component';

describe('EstateBuildingComponent', () => {
  let component: EstateBuildingComponent;
  let fixture: ComponentFixture<EstateBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
