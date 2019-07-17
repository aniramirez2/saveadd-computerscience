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
  selector: 'app-erros',
  templateUrl: './erros.component.html',
  styleUrls: ['./erros.component.scss']
})
export class ErrosComponent implements OnInit {
  deferimentos:any = []
  empresas:any= []
  usuarios:any= []
  erros: any;
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
        //this.listarDeferimentosOng()
      }else if(usuario.TipoUsuario == 2){
        this.listarErros()
      }
    },error=>{
      if(error.status == 401 || error.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
    

  }
  
  listarErros(){
    this.admin.listarErros().subscribe(res=>{
      this.erros = res
      //console.log('erros', this.erros)
      this.spiner.hide()
    },err=>{
      this.spiner.hide()
      if(err.status == 401){
        localStorage.removeItem('appSaveAdd');
        window.location.reload();
      }
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
      console.log('deferimento',JSON.stringify(deferimentoaux))
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
}
