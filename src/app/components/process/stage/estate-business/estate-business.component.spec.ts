import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateBusinessComponent } from './estate-business.component';

describe('EstateBusinessComponent', () => {
  let component: EstateBusinessComponent;
  let fixture: ComponentFixture<EstateBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstateBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstateBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
