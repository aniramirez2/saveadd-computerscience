import { EmpresaService, Empresa } from './../../providers/empresa.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-remove-empresa',
  templateUrl: './remove-empresa.component.html',
  styleUrls: ['./remove-empresa.component.scss']
})
export class RemoveEmpresaComponent implements OnInit {
  empresa: Empresa;
  public success = new Subject<string>();
  successMessage: string;
  deleted = false;
  constructor(
    public activeModal: NgbActiveModal,
    public empresaService: EmpresaService
  ) {}

  ngOnInit() {}

  remove() {
    this.empresaService.delete(this.empresa.IdEmpresa).subscribe(res => {
      this.deleted = true;
      if (!this.successMessage) {
        this.successMessage = 'A empresa foi removida';
      }
    });
  }
}
