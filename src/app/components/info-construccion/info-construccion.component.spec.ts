import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoConstruccionComponent } from './info-construccion.component';

describe('InfoConstruccionComponent', () => {
  let component: InfoConstruccionComponent;
  let fixture: ComponentFixture<InfoConstruccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoConstruccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoConstruccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
