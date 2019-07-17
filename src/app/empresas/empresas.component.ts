import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmpresaService, Empresa } from './../providers/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEmpresaComponent } from './create-empresa/create-empresa.component';
import { RemoveEmpresaComponent } from './remove-empresa/remove-empresa.component';
import { conformToMask } from 'angular2-text-mask';
import { masks } from '../masks';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
  // entryComponents: [CreateEmpresaComponent, RemoveEmpresaComponent]
})
export class EmpresasComponent implements OnInit {
  empresas: Empresa[];
  loadging_page = false;
  constructor(
    public empresasService: EmpresaService,
    public modalService: NgbModal,
    public router: Router
  ) {}

  ngOnInit() {
    this.loadging_page = true;
    this.empresasService.getEmpresas().subscribe(
      res => {
        this.loadging_page = false;
        this.empresas = res as Empresa[];
      },
      error => {
        this.loadging_page = false;
        if(error.status == 401 || error.status == 403 ){
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
      }
    );
  }

  openCreateModal(empresa: Empresa) {
    const modalRef = this.modalService.open(CreateEmpresaComponent);
    modalRef.componentInstance.matriz = empresa;
  }

  conformCnpj(value: string) {
    return conformToMask(value, masks.cnpj, { guide: false }).conformedValue;
  }

  openRemoveModal(empresa: Empresa) {
    const modalRef = this.modalService.open(RemoveEmpresaComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.empresa = empresa;
    modalRef.result.then(
      res => {
        if (res) {
          const index = this.empresas.findIndex(
            x => x.IdEmpresa === empresa.IdEmpresa
          );
          if (index > -1) {
            this.empresas.splice(index, 1);
          }
        }
        console.log('close ' + res);
      },
      reason => {
        console.log(reason);
      }
    );
  }
}
