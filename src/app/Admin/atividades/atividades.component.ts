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
  selector: 'app-atividades',
  templateUrl: './atividades.component.html',
  styleUrls: ['./atividades.component.scss']
})
export class AtividadesComponent implements OnInit {
  statusAtividades:any = [
    {"nome":"Login", "Id": 0},
    {"nome":"Insert", "Id":1},
    {"nome":"Update", "Id":2},
    {"nome":"Delete", "Id":3}
  ]
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
        this.listarAtividades()
      }
    },error=>{
      if(error.status == 401 || error.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
    

  }
  
  listarAtividades(){
    this.spiner.show()
    this.admin.listarAtividades().subscribe(res=>{
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

  nomeAtividade(id){
    var aux = this.statusAtividades.filter(atividade=>{
      if(atividade.Id == id){
        return atividade
      }
    })
    return aux[0].nome
  }
}
