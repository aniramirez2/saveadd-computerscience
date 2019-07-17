import { Component, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
import { AuthService } from '../providers/auth.service';
import {Router,ActivatedRoute} from '@angular/router'
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-login-recuperacao',
  templateUrl: './login-recuperacao.component.html',
  styleUrls: ['./login-recuperacao.component.scss']
})
export class LoginRecuperacaoComponent implements OnInit {
  loading: boolean;

  constructor(
    public AuthService:AuthService,
    public route:ActivatedRoute,
    public router:Router,
    ) { }
  emailrec:any=""
  ngOnInit() {

  }
  passwordForm(){
    var aux= new FormControl(this.emailrec, Validators.compose([
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
    ]))
    if(aux.errors != null){
      if(aux.errors.required){
        swal("Erro", "Por favor preencha o campo de email", "error");
      }else{
        swal("Erro", "Email com formato invalido", "error");
      }
    }else{
      this.loading= true
      this.AuthService.recuperarSenha(this.emailrec).subscribe(res=>{
        console.log("res", res)
        this.loading= false
        if(res){
          swal("Sucesso", "Sua petição para mudar a senha foi enviada com sucesso, por favor verifique sua caixa de email", "success").then(res=>{
            this.router.navigate(['/']);
          });
        }else{
          swal("Erro", "Parece que seu email não esta cadastrado na plataforma", "error")
        }
        
      })
    }
  }
}
