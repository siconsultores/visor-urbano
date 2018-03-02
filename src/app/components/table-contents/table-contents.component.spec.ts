import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContentsComponent } from './table-contents.component';

describe('TableContentsComponent', () => {
  let component: TableContentsComponent;
  let fixture: ComponentFixture<TableContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
