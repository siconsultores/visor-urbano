import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RippledButtonComponent } from './rippled-button.component';

describe('RippledButtonComponent', () => {
  let component: RippledButtonComponent;
  let fixture: ComponentFixture<RippledButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RippledButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RippledButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
