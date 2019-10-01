import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverableRowComponent } from './hoverable-row.component';

describe('HoverableRowComponent', () => {
  let component: HoverableRowComponent;
  let fixture: ComponentFixture<HoverableRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoverableRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
