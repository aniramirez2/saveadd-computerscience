import {
  Empresa,
  EmpresaService,
  Telefone
} from './../../providers/empresa.service';
import { Component, OnInit } from '@angular/core';
import { Endereco } from '../../providers/empresa.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-phone',
  templateUrl: './add-phone.component.html',
  styleUrls: ['./add-phone.component.scss']
})
export class AddPhoneComponent implements OnInit {
  updating = false;
  updated = false;
  phone: Telefone;
  empresa: Empresa;
  constructor(
    public empresaService: EmpresaService,
    public activeModal: NgbActiveModal
  ) {
    this.phone = this.empresaService.instantiateTelefone();
  }

  ngOnInit() {}

  update() {
    this.empresa.Telefones.push(this.phone);
    this.updating = true;
    this.empresaService.update(this.empresa).subscribe(
      res => {
        this.updating = false;
        this.updated = false;
      },
      error => {
        this.updating = false;
        this.updated = false;
      }
    );
  }
}
