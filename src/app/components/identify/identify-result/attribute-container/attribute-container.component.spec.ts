import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeContainerComponent } from './attribute-container.component';

describe('AttributeContainerComponent', () => {
  let component: AttributeContainerComponent;
  let fixture: ComponentFixture<AttributeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
