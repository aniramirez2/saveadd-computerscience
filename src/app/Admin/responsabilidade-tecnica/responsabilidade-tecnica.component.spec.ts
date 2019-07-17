import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsabilidadeTecnicaComponent } from './responsabilidade-tecnica.component';

describe('ResponsabilidadeTecnicaComponent', () => {
  let component: ResponsabilidadeTecnicaComponent;
  let fixture: ComponentFixture<ResponsabilidadeTecnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsabilidadeTecnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsabilidadeTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
