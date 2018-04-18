import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarComponent } from './changecalendar.component';

describe('ChangecalendarComponent', () => {
  let component: ChangecalendarComponent;
  let fixture: ComponentFixture<ChangecalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangecalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangecalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
