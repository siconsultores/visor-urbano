import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateFinishComponent } from './estate-finish.component';

describe('EstateFinishComponent', () => {
  let component: EstateFinishComponent;
  let fixture: ComponentFixture<EstateFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
