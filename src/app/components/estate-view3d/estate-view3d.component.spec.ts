import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateView3dComponent } from './estate-view3d.component';

describe('EstateView3dComponent', () => {
  let component: EstateView3dComponent;
  let fixture: ComponentFixture<EstateView3dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateView3dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateView3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
