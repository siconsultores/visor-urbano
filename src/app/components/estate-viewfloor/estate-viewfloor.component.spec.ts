import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateViewfloorComponent } from './estate-viewfloor.component';

describe('EstateViewfloorComponent', () => {
  let component: EstateViewfloorComponent;
  let fixture: ComponentFixture<EstateViewfloorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateViewfloorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateViewfloorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
