import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealreplyComponent } from './appealreply.component';

describe('AppealreplyComponent', () => {
  let component: AppealreplyComponent;
  let fixture: ComponentFixture<AppealreplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealreplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealreplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
