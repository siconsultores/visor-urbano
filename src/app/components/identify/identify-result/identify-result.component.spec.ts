import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifyResultComponent } from './identify-result.component';

describe('IdentifyResultComponent', () => {
  let component: IdentifyResultComponent;
  let fixture: ComponentFixture<IdentifyResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifyResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifyResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
