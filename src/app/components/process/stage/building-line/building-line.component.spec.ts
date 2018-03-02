import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLineComponent } from './building-line.component';

describe('BusinessLineComponent', () => {
  let component: BusinessLineComponent;
  let fixture: ComponentFixture<BusinessLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
