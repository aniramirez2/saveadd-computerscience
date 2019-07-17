import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidosService } from '../../../providers/pedidos.service';
import { AdminService } from '../../../providers/admin.service';
import { UserService } from '../../../providers/user.service';
import { conformToMask } from 'angular2-text-mask';
import { masks } from '../../../masks';
import { EmpresaService } from '../../../providers/empresa.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;


@Component({
  selector: 'app-detalhedef',
  templateUrl: './detalhedef.component.html'
})
export class DetalheDeferimentoComponent implements OnInit {
  sub: any;
  idPedido: any;
  pedido: any = null;
  usuarios:any
  isAdminSave:any = false
  isAdminPrefeitura:any =false

  CodigoBarras: any = [
    {
      Codigo: null,
      TipoCodigoBarras: 1
    }
  ]
  ongs: any;
  estados: any;
  empresa: any;
  
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public empresasService: EmpresaService,
    public PedidosService: PedidosService,
    public Admin: AdminService,
    public UserService: UserService

  ) {
   }

  ngOnInit() {
    this.Admin.listarDeferimento().subscribe(res => {
      this.ongs = res
      this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.idPedido = params;
        this.getPedido(this.idPedido.id)
        
        return this.idPedido
      });
      this.isAdminSave = true
    }, err=>{
      this.isAdminPrefeitura = true
      this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.idPedido = params;
        this.getDeferimentoPrefeitura(this.idPedido)
        
        return this.idPedido
      });
    });
    
    
    this.empresasService.getEstados().subscribe(res => {
      this.estados = res;
      
    });
  }
  getPedido(id){
    this.pedido = this.ongs.filter(on=>{
      return on.IdDeferimento== Number(id)
    })[0]
    console.log('deferimeto', this.pedido)
    this.getUsuarios(this.pedido.IdEmpresa)
    this.getUsuarioDef(this.pedido.UsuarioDeferimento)
  }
  getUsuarioDef(id){
    this.UserService.getUserById2(id).subscribe(res=>{
      var aux:any = res
      this.pedido.NomeUsuario = aux.NomeUsuario
    })
  }
  atualizarPedido(status, deferimento){
    if(status ==2 ){
      swal('Tem certeza que quer rejeitar este cadastro?')
      .then((willDelete) => {
        if (willDelete) {
          var deferimentoaux = {
            "IdDeferimento": deferimento.IdDeferimento,
            "StatusDeferimento": status,
            "Observacoes": ""
          }
          console.log('deferimento',JSON.stringify(deferimentoaux))
          if(this.isAdminPrefeitura){
            this.updatedefeirmentoPrefeitura(deferimentoaux)
          }else{
            this.updatedefeirmentoSave(deferimentoaux)
          }
        } else {
        }
      });
    }else{
      var deferimentoaux = {
        "IdDeferimento": deferimento.IdDeferimento,
        "StatusDeferimento": status,
        "Observacoes": null
      }
      console.log('deferimento',JSON.stringify(deferimentoaux))
      if(this.isAdminPrefeitura){
        this.updatedefeirmentoPrefeitura(deferimentoaux)
      }else{
        this.updatedefeirmentoSave(deferimentoaux)
      }
    }
    
  }
  updatedefeirmentoSave(deferimentoaux){
    this.Admin.atualizarDeferimento( deferimentoaux).subscribe(res=>{
      if(res){
        swal("Sucesso", "Deferimento atualizado com sucesso!", "success")
      }else{
        swal("Erro", "Ops, o deferimento não foi atualizado!", "error")
      }
      this.ngOnInit()
    })
  }
  updatedefeirmentoPrefeitura(deferimentoaux){
    this.Admin.atualizarDeferimentoPrefeitura( deferimentoaux).subscribe(res=>{
      if(res){
        swal("Sucesso", "Deferimento atualizado com sucesso!", "success")
      }else{
        swal("Erro", "Ops, o deferimento não foi atualizado!", "error")
      }
      this.ngOnInit()
    })
  }
  getDeferimentoPrefeitura(iddef){
    var id = Number(iddef.id)
    this.Admin.listarDeferimentoPrefeitura().subscribe(res => {
      this.ongs = res
      console.log('empresa', this.ongs)
      console.log('id def',id )
        this.pedido = this.ongs.filter(on=>{
          return on.IdDeferimento == id
        })[0]
        console.log('deferimento', this.pedido)
        this.getUsuarios(this.pedido.IdEmpresa)
        this.getUsuarioDef(this.pedido.UsuarioDeferimento)
    });
  }
  getUsuarios(id){
    this.empresasService.getEmpresaById(id).subscribe(res => {
      this.usuarios = res
    })
  }
  conformCnpj(value: string) {
    return conformToMask(value, masks.cnpj, { guide: false }).conformedValue;
  }
  conformCpf(value: string) {
    return conformToMask(value, masks.cpf, { guide: false }).conformedValue;
  }
  getNomeEstado(id){
    return this.estados.filter(estado=>{
      return estado.IdEstado == Number(id)
    })[0].NomeEstado
  }
  formatValue(value) {
    var valor:any = parseFloat(value).toFixed(2);
    var totalConvertido = valor.toString().replace(".", ",");
    return totalConvertido
  }
    
  

}
