import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../providers/admin.service'
import { EmpresaService } from '../../providers/empresa.service'
import { UserService } from '../../providers/user.service'
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-deferimento-cadastral',
  templateUrl: './deferimento-cadastral.component.html',
  styleUrls: ['./deferimento-cadastral.component.scss']
})
export class DeferimentoCadastralComponent implements OnInit {
  deferimentos:any = []
  empresas:any= []
  usuarios:any= []
  constructor(
    public admin: AdminService,
    public empresa: EmpresaService,
    public usuario: UserService,
    public spiner:  NgxSpinnerService,
    public route: ActivatedRoute,
    public router: Router, 
  ) {
     }

  ngOnInit() {
    this.spiner.show()
    this.usuario.getUserById('0').subscribe(res=>{
      //console.log('user admin',res)
      var usuario:any = res
      if(usuario.TipoUsuario == 1){
        this.listarDeferimentosOng()
      }else if(usuario.TipoUsuario == 2){
        this.listarDeferimentos()
      }
    },error=>{
      if(error.status == 401 || error.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
    

  }
  detalhe(deferimento){
    this.router.navigate(['admin/detalheDeferimento'], { queryParams: { id: deferimento.IdDeferimento } })
  }
  
  listarDeferimentos(){
    this.admin.listarDeferimento().subscribe(res=>{
      this.deferimentos = res
      this.orderByDate(this.deferimentos)
      //console.log('deferimentos', this.deferimentos)
      this.deferimentos.forEach(element => {
        this.getEmpresaNome(element)
        this.getUsuario(element)
      });
      this.spiner.hide()
    },err=>{
      this.spiner.hide()
      if(err.status == 401){
        localStorage.removeItem('appSaveAdd');
        window.location.reload();
      }
    })
    
  }
  listarDeferimentosOng(){
    this.admin.listarDeferimentoPrefeitura().subscribe(res=>{
      this.deferimentos = res
      this.orderByDate(this.deferimentos)
      //console.log('deferimentos ongs', this.deferimentos)
      this.deferimentos.forEach(element => {
        this.getEmpresaNome(element)
        this.getUsuario(element)
      });
      this.spiner.hide()
    },err=>{
      this.spiner.hide()
      if(err.status == 401){
        localStorage.removeItem('appSaveAdd');
        window.location.reload();
      }
    })
    
  }
  getEmpresaNome(element){
    this.empresa.getEmpresaById(element.IdEmpresa).subscribe(res=>{
      var aux: any = res
      //console.log('empresa', res)
      element.NomeEmpresa = aux.NomeEmpresa
      if(aux.TipoEmpresa == 1){
        element.TipoEmpresa = 'Ong'
      }
      if(aux.TipoEmpresa == 2){
        element.TipoEmpresa = 'Ong Conveniada'
      }
      if(aux.TipoEmpresa == 0){
        element.TipoEmpresa = 'Empresa Normal'
      }
    })
  }
  getUsuario(element){
    this.usuario.getUserById2(element.UsuarioInclusao).subscribe(res=>{
      var aux:any = res
      element.NomeUsuario = aux.NomeUsuario
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
          //console.log('deferimento',JSON.stringify(deferimentoaux))
          this.admin.atualizarDeferimento( deferimentoaux).subscribe(res=>{
            if(res){
              swal("Sucesso", "Deferimento atualizado com sucesso!", "success")
            }else{
              swal("Erro", "Ops, o deferimento não foi atualizado!", "error")
            }
            this.ngOnInit()
          })
        } else {
        }
      });
    }else{
      var deferimentoaux = {
        "IdDeferimento": deferimento.IdDeferimento,
        "StatusDeferimento": status,
        "Observacoes": null
      }
      //console.log('deferimento',JSON.stringify(deferimentoaux))
      this.admin.atualizarDeferimento( deferimentoaux).subscribe(res=>{
        if(res){
          swal("Sucesso", "Deferimento atualizado com sucesso!", "success")
        }else{
          swal("Erro", "Ops, o deferimento não foi atualizado!", "error")
        }
        this.ngOnInit()
      })
    }
    
  }
  orderByDate(arr) {
    arr.sort(function compare(a, b) {
      var dateA:any = new Date(a.DataInclusao);
      var dateB:any = new Date(b.DataInclusao);
      return dateB - dateA;
    });
    this.deferimentos = arr;
    //console.log('pedidos',this.pedidos)
  }
  
}
