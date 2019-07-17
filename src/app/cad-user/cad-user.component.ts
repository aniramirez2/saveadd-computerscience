import { User, UserService, EnderecoUser, TelefoneUser } from './../providers/user.service';
import {
  EmpresaService,
  Empresa,
  Endereco,
  Telefone
} from './../providers/empresa.service';
import { masks } from './../masks';
import { Component, OnInit, Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError, debounceTime } from 'rxjs/operators';
import { UtilsService } from '../shared/utils.service';
import { AuthService } from '../providers/auth.service';
import { ProductService } from '../providers/product.service';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-cad-user',
  templateUrl: './cad-user.component.html',
  styleUrls: ['./cad-user.component.scss']
})
@Injectable()
export class CadUserComponent implements OnInit {
  empresa: Empresa;
  endereco: Endereco;
  telefone: Telefone;
  Complemento: string;
  searched_cnpj: string;
  emailFiscal: string;
  user: User;
  masks = masks;
  confirm_password: string = null;
  successMessage: string = null;
  searching = false;
  saving = false;
  saved = false;
  swal: any;
  estados=[]
  auxEstado
  intencoes
  manualCnpj = false
  isCnpjInvalid= false
  is_cnpj = true
  selectedPeople1 =[]
  categorias: Observable<any[]>;
  empresaManual:Empresa = {
    "IdEmpresa": "",
    "IdEmpresaMatriz": "",
    "Cnpj": "",
    "NomeEmpresa": "",
    "RazaoSocial": "",
    "InscricaoEstadual": "",
    "TipoEmpresa": 0,
    "StatusEmpresa": 0,
    "Enderecos": [],
    "Telefones": [],
    "FormasPagamento": [],
    "Intencoes":[],
    "ValorPedidoMinimo":0,
    "DadosBancarios":[],
    "EmailFiscal":""
  }
  is_ong=false
  is_ong_conveniada=false
  public success = new Subject<string>();
  address: EnderecoUser;
  addresses:any=[];
  telefoneAux: TelefoneUser;
  telefones:any=[]
  message: string;
  interesses:any = []
  clickedInType= false
  options = {
    multiple: true
  }
  item: any;
  iEchecado = true;
  enderecoUser: EnderecoUser;
  constructor(
    public http: HttpClient,
    public empresaService: EmpresaService,
    public utils: UtilsService,
    public userService: UserService,
    public authService: AuthService,
    public router: Router,
    public producService: ProductService
  ) {
    this.user = this.userService.instantiateUser();
    this.address = this.userService.instantiateEndereco();
    this.telefoneAux = this.userService.instantiateTelefone();
    this.empresa = this.empresaService.instantiateEmpresa();
    this.endereco = this.empresaService.instantiateEndereco();
    this.telefone = this.empresaService.instantiateTelefone();
    this.enderecoUser = this.userService.instantiateEndereco()
  }

  ngOnInit() {
    this.getEstados()
    this.categorias = this.producService.getInteresses()
    this.getIntencoes()
    this.success.pipe(debounceTime(4000)).subscribe(() => {
      this.router.navigate(['/']);
    });
    this.success.subscribe(message => (this.successMessage = message));
  }
  selectedItem(item, event){
    console.log("item intencoes", item)
    item.isChecked = !item.isChecked;
    if(event.target.checked){
      this.empresa.Intencoes.push(item)
    }else{
      var aux =  this.empresa.Intencoes.findIndex(i => i.IdIntencao === item.IdIntencao);
      this.empresa.Intencoes.splice(aux, 1);
    }
  }
  buscaEmpresaOnReceita() {
    this.isCnpjInvalid= false
    this.empresa.Telefones = []
    this.searching = true;
    const cnpj = this.utils.unmask(this.searched_cnpj);
    if (cnpj.length === 14) {
      this.empresaService.searchEmpresaOnReceita(cnpj).subscribe(res => {
        const response: any = res;
        if (response.status === 'OK') {
          this.empresa = null
          this.searching = false;
          this.empresa = this.empresaService.receitaToLocal(response);
           this.auxEstado=this.empresa.Enderecos[0].Estado
           this.manualCnpj = false
        } else {
          this.searching = false;
          this.isCnpjInvalid = false
        }
      },
      error=>{
        if(!error.ok){
          this.empresa = this.empresaManual
          this.searching = false;
          this.manualCnpj = true
          this.is_cnpj = true
          //this.isCnpjInvalid = true
          swal("Erro", "O Cnpj consultado não aparece nos dados da receita federal, por favor preencha os dados manualmente", "error");
          console.log("error", error)
          this.empresaManual = this.empresa
          this.empresaManual.Enderecos[0] = {
            Pais: 'Brasil',
            Cep: null,
            Estado: null,
            Cidade: null,
            Bairro: null,
            Logradouro: null,
            Complemento: null,
            Numero: null,
            PermiteRetirada: 1,
            RealizaEntrega: 1,
            StatusEndereco: 1
          }
          this.empresa.Telefones[0]={
            Area: null,
            Numero: null,
            Ramal: null,
            Pais: 'Brasil',
            StatusTelefone: 1
          }
        }
        //this.isCnpjInvalid = true
      });
    } else {
      this.isCnpjInvalid = true
    }
  }
  searchCep(){
    this.is_cnpj = false
   
  }
  addInteresses(item){
    this.interesses.push(item)
  }
  findAddress() {
    if (this.address.Cep.length === 8) {
      this.empresaService.getAddres(this.address.Cep).subscribe(
        res => {
          const consulted_cep: any = res;
          //this.address.Cep = this.cep;
          this.address.Cidade = consulted_cep.localidade;
          this.address.Bairro = consulted_cep.bairro;
          this.address.Logradouro = consulted_cep.logradouro;
          this.address.Complemento = consulted_cep.complemento;
          this.setIdEstado(consulted_cep.uf)
         //this.user.Enderecos.push(this.address)
        },
        error => {
          this.message = 'Nada encontrado para este CEP';
        }
      );
    }
  }
  setIdEstado(estado){
    var aux:any;
    aux = this.estados.filter(est=>{
       return est.NomeEstado === estado
    })
    this.address.Estado =aux[0].IdEstado
  }
  selectState2(value){   
    this.address.Estado = Number(value)
    this.empresa.Enderecos[0].Estado=Number(value)
  }
  setTipoEmpresa(value){
     this.clickedInType = true
    if(value == 1){
      this.is_ong = true
    }else{
      this.is_ong = false
    }
    //this.empresa.TipoEmpresa = value;
  }
  setTipoEmpresaConveniada(value){
    if(value == 1){
      this.is_ong_conveniada = true
    }else{
      this.is_ong_conveniada = false
    }
  }
  jobsDeselected(item){
    var aux = this.interesses.map(function(e) { return e.IdInteresse; }).indexOf(item.IdCategoria);
    this.interesses.splice(aux, 1);
  }
  register() {
    if(this.is_cnpj == true){
      if(this.clickedInType){
        if(this.is_ong){
          this.empresa.TipoEmpresa = 1
        }
        if(this.is_ong_conveniada){
          this.empresa.TipoEmpresa = 2
        }
        this.user.Cpf = this.utils.unmask(this.user.Cpf);
        this.user.Interesses = this.interesses
        this.empresa.Cnpj = this.utils.unmask(this.empresa.Cnpj);
        if(this.empresa.Cnpj == ''){
          this.empresa.Cnpj = this.utils.unmask(this.searched_cnpj)
        }
        this.empresa.EmailFiscal = this.emailFiscal
        this.empresa.Enderecos[0].NomeEndereco = 'Faturamento';
        this.empresa.DadosBancarios = []        
        this.SearchByNameState(this.empresa.Enderecos[0], 0)
        this.saving = true;
        this.user.Enderecos = []
        this.user.Telefones = []
        this.empresa.ValorPedidoMinimo = 0
        console.log('before send empresa', JSON.stringify(this.empresa))
        console.log('before send this.user', JSON.stringify(this.user))
        if(this.empresa.Intencoes.length > 0){
          this.userService.register(this.empresa, this.user).subscribe(
            res => {
              this.saving = false;
              this.saved = true; 
                  if (!this.successMessage) {
                swal("Sucesso", "Cadastro realizado com Sucesso!", "success");
                    
                this.router.navigate(['/'])
              
                  }
                },
                err => {
                  this.saving = false;
                  swal("Erro", err.error.Mensagem, "error");
            }
            );
        }else{
            
            swal("erro","O campo Intenções é obrigatorio","error")
            this.saving = false;
          }
        }else{
          swal("erro","Por favor especifique se sua empresa é uma ONG/OS/OSC/OSCIP","error")
        this.saving = false;
      }
          
        }else{
         this.registerPessoaFisica()
    }
    } 
    registerPessoaFisica(){
      this.user.Cpf = this.utils.unmask(this.user.Cpf);
        this.saving = true;
        this.addresses.push(this.address)
        this.user.Enderecos= this.addresses
        this.telefones.push(this.telefoneAux) 
        //this.user.Enderecos = this.addresses
        this.user.Telefones = this.telefones
       this.userService.register(null, this.user).subscribe(
          res => {
            this.saving = false;
            this.saved = true;
            if (!this.successMessage) {
              swal("Sucesso", "Cadastro realizado com Sucesso!", "success");
              //window.location.reload();
              this.router.navigate(['/login'])
            }
          },
          err => {
            this.saving = false;
            swal("Erro", err.error.Mensagem, "error");
          }
      );
      
    } 
    getEstados(){
      this.empresaService.getEstados().subscribe(
        res => {
          var any:any = res
          this.estados = any
          console.log("estados", this.estados)
        },
        error => {
          console.log("error",error)
        }
      );
    } 
    getIntencoes(){
      this.empresaService.getIntencoes().subscribe(
        res => {
          this.intencoes = res
        },
        error => {
          console.log("error",error)
        }
      );
    } 
    selectState(value, i){
      var aux = value.split(":")
      this.empresa.Enderecos[0].Estado = aux[1]
      //this.empresa.Enderecos[i].Estado = Number(aux[1])
    } 
    checkIe(e){
      this.iEchecado = !this.iEchecado
      console.log("this.iEchecado",this.iEchecado)
    } 
    SearchByNameState(elemento, index){
      this.estados.forEach(element => {
        if(element.NomeEstado === elemento.Estado){
          this.empresa.Enderecos[index].Estado = element.IdEstado
        }
      });
  }
}
