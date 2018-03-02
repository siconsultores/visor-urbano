import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomStepComponent } from './bottom-step.component';

describe('BottomStepComponent', () => {
  let component: BottomStepComponent;
  let fixture: ComponentFixture<BottomStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
