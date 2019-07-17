import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveEmpresaComponent } from './remove-empresa.component';

describe('RemoveEmpresaComponent', () => {
  let component: RemoveEmpresaComponent;
  let fixture: ComponentFixture<RemoveEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
