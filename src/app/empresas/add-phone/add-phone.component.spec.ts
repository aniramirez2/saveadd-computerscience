import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhoneComponent } from './add-phone.component';

describe('AddPhoneComponent', () => {
  let component: AddPhoneComponent;
  let fixture: ComponentFixture<AddPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
