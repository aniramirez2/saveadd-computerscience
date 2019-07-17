import {
  EmpresaService,
  Empresa,
  Endereco
} from './../../providers/empresa.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { stringify } from '@angular/core/src/util';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit {
  address: Endereco;
  empresa: Empresa;
  updating = false;
  updated = false;
  message: string;
  cep: string;
  estados:any;
  allProfiles = [
    {Id:0, Nome:"Faturamento"},
    {Id:1, Nome:"Entrega"},
    {Id:2, Nome:"Estoque"}
  ];
  constructor(
    public activeModal: NgbActiveModal,
    public service: EmpresaService
  ) {
    this.address = this.service.instantiateEndereco();
  }

  ngOnInit() {
    this.service.getEstados().subscribe(res => {
      this.estados = res;
    });
  }

  update() {
    if(this.empresa.DadosBancarios.length >0){
      if(this.empresa.DadosBancarios[0].IdDadosBancarios == null){
        this.empresa.DadosBancarios =[]
      }
    }
    this.address.PermiteRetirada =0
    this.address.RealizaEntrega=0
    this.empresa.Enderecos.push(this.address);
    this.service.update(this.empresa).subscribe(
      res => {
        this.updating = false;
        this.updated = false;
        console.log("res empresa", res)
        swal('Suceso','Endereço adicionado com sucesso', 'success')
        // this.empresa.Enderecos.push(this.address);
        this.activeModal.close({
          updated: this.updated,
          empresa: this.empresa
        });
      },
      error => {
        swal('Erro',error.error.Mensagem, 'error')
        this.updating = false;
        this.updated = false;
        this.activeModal.close({
          updated: this.updated,
          empresa: this.empresa
        });
      }
    );
  }
  addTipoEndereco(value){
    var aux =value.split(":")
    console.log('value', aux[1])
    this.address.TipoEndereco = Number(aux[1])
  }
  selectState(value){
    var aux = value.split(":")
    this.address.Estado = Number(aux[1])
  }
  setIdEstado(estado){
    var aux:any;
    aux = this.estados.filter(est=>{
       return est.NomeEstado === estado
    })
    this.address.Estado =aux[0].IdEstado
  }
  findAddress() {
    if (this.cep.length === 8) {
      this.service.getAddres(this.cep).subscribe(
        res => {
          const consulted_cep: any = res;
          this.address.Cep = this.cep;
          this.address.Cidade = consulted_cep.localidade;
          this.address.Bairro = consulted_cep.bairro;
          this.address.Logradouro = consulted_cep.logradouro;
          this.address.Complemento = consulted_cep.complemento;
          this.setIdEstado(consulted_cep.uf)
        },
        error => {
          this.message = 'Nada encontrado para este CEP';
        }
      );
    }
  }
}
