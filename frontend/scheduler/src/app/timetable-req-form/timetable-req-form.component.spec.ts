import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableReqFormComponent } from './timetable-req-form.component';

describe('TimetableReqFormComponent', () => {
  let component: TimetableReqFormComponent;
  let fixture: ComponentFixture<TimetableReqFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimetableReqFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableReqFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
