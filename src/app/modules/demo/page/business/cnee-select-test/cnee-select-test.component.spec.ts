import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CneeSelectTestComponent } from './cnee-select-test.component';

describe('CneeSelectTestComponent', () => {
  let component: CneeSelectTestComponent;
  let fixture: ComponentFixture<CneeSelectTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CneeSelectTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CneeSelectTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
