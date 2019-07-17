import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroNewUserComponent } from './cadastro-new-user.component';

describe('CadastroNewUserComponent', () => {
  let component: CadastroNewUserComponent;
  let fixture: ComponentFixture<CadastroNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
