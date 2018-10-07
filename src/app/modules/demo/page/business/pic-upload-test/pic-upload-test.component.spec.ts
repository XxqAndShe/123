import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicUploadTestComponent } from './pic-upload-test.component';

describe('PicUploadTestComponent', () => {
  let component: PicUploadTestComponent;
  let fixture: ComponentFixture<PicUploadTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicUploadTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicUploadTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
