import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateDrawingComponent } from './estate-drawing.component';

describe('EstateDrawingComponent', () => {
  let component: EstateDrawingComponent;
  let fixture: ComponentFixture<EstateDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
