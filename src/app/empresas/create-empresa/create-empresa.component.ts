import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Empresa,
  EmpresaService,
  Endereco,
  Telefone
} from '../../providers/empresa.service';
import { masks } from '../../masks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-empresa',
  templateUrl: './create-empresa.component.html',
  styleUrls: ['./create-empresa.component.scss']
})
export class CreateEmpresaComponent implements OnInit {
  empresa: Empresa;
  endereco: Endereco;
  telefone: Telefone;
  matriz: Empresa = null;
  cnpjMask = masks.cnpj;
  not_found = false;
  cnpjToSearch: string = null;
  searching = false;
  saving = false;
  created = false;
  estados
  auxEstado
  constructor(
    public activeModal: NgbActiveModal,
    public empresaService: EmpresaService,
    public router: Router
  ) {
    this.createObjects();
  }

  ngOnInit() {
    this.getEstados()
    // this.buscaEmpresaOnReceita('08588649000187');
  }
  setEstadoNumber(Estado){
    var aux:any;
    aux = this.estados.filter(est=>{
       return est.NomeEstado === Estado
    })
    this.endereco.Estado =aux[0].IdEstado
    this.empresa.Enderecos = [this.endereco];
  }
  saveEmpresa() {
    this.empresa.Enderecos = [this.endereco];
    this.empresa.Telefones = [this.telefone];
    this.setEstadoNumber(this.endereco.Estado)
    this.empresa.IdEmpresaMatriz = this.matriz ? this.matriz.IdEmpresa : '0';
    this.empresa.TipoEmpresa = this.matriz ? 1 : 0;
    this.saving = true;
  }

  updateCnpj(value) {
    this.cnpjToSearch = this.unmask(value);
    this.not_found = false;
  }

  buscaEmpresaOnReceita() {
    if (this.cnpjToSearch.length === 14) {
      this.searching = true;

      this.empresaService.searchEmpresaOnReceita(this.cnpjToSearch).subscribe(
        res => {
          this.searching = false;

          const response: any = res;
          if (response.status === 'OK') {
            this.createObjects();
            this.empresa = this.empresaService.receitaToLocal(response);
            this.endereco = this.empresa.Enderecos[0];
          } else {
            this.createObjects();
            this.not_found = true;
          }
        },
        error => {
          this.searching = false;
        }
      );
    } else {
      this.not_found = true;
    }
  }

  unmask(value: string) {
    return value.replace(/\D+/g, '');
  }
  getEstados(){
    this.empresaService.getEstados().subscribe(
      res => {
        this.estados = res
      },
      error => {
        console.log("error",error)
      }
    );
  }
  SearchByNameState(name):any{
    this.estados.forEach(element => {
      if(element.NomeEstado === name){
        this.empresa.Enderecos[0].Estado = element.IdEstado
      }
    });
  }
  createObjects() {
    this.empresa = {
      Cnpj: null,
      IdEmpresaMatriz: '0',
      RazaoSocial: null,
      NomeEmpresa: null,
      InscricaoEstadual: null,
      TipoEmpresa: null,
      Enderecos: null,
      FormasPagamento: null,
      Telefones: null,
      Intencoes:null,
      ValorPedidoMinimo:null,
      DadosBancarios:null,
      EmailFiscal:null
    };

    this.telefone = {
      Area: null,
      Numero: null,
      Ramal: null,
      Pais: 'Brasil',
      StatusTelefone: 1
    };
    this.endereco = {
      Pais: 'Brasil',
      Cep: null,
      Estado: null,
      Cidade: null,
      Bairro: null,
      Logradouro: null,
      Numero: null,
      PermiteRetirada: 1,
      RealizaEntrega: 1,
      StatusEndereco: 1
    };
  }
}
