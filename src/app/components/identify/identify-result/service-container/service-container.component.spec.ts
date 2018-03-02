import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceContainerComponent } from './service-container.component';

describe('ServiceContainerComponent', () => {
  let component: ServiceContainerComponent;
  let fixture: ComponentFixture<ServiceContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
