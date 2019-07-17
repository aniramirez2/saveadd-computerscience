import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { AuthService } from '../providers/auth.service';
import {Router,ActivatedRoute} from '@angular/router'
import { NgxSpinnerService } from 'ngx-spinner';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-login-senha',
  templateUrl: './login-senha.component.html',
  styleUrls: ['./login-senha.component.scss']
})
export class LoginSenhaComponent implements OnInit {
  idUsuario:any
  token:any
  loading: boolean;
  emailconfirmation:any =''
  constructor(
    public AuthService:AuthService,
    public route:ActivatedRoute,
    public router:Router,
    public spinner: NgxSpinnerService,
    ) { 
      
    }
  emailrec:any=""
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.idUsuario = params['idUsuario'];
      this.token = params['token'];
  });
  }
  passwordForm(){
    this.spinner.show()
    if(this.emailconfirmation == this.emailrec){
      this.spinner.hide()
    var aux= new FormControl(this.emailrec, Validators.compose([
      Validators.required,
      Validators.minLength(6),
    ]))
    if(aux.errors != null){
      if(aux.errors.required){
        swal("Erro", "Por favor preencha a senha", "error");
      }else{
        swal("Erro", "A senha deve ter minimo 6 digitos ", "error");
      }
    }else{
      this.loading = true
      this.AuthService.enviarNovaSenha(this.idUsuario,this.token,this.emailrec).subscribe(res=>{
        console.log("res", res)
        this.loading = false
        if(res){
          swal("Sucesso", "Sua senha foi mudada com sucesso", "success").then(res=>{
            this.router.navigate(['/']);
          });
        }else{
          swal("Erro", "Não foi possivel alterar sua senha", "error");
        }
        
      }, error=>{
        this.loading = false
        swal("Erro", "Ops "+ error.error.Mensagem, "error");
      })
    }
  }
  else{
    this.spinner.hide()
    swal("Erro", "Senhas não coincidem", "error");
  } 
} 
}
