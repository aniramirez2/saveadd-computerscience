import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { User, UserService } from './../providers/user.service';
import { masks } from './../masks';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router , ActivatedRoute } from '@angular/router';
import { map, catchError, debounceTime } from 'rxjs/operators';
import { UtilsService } from '../shared/utils.service';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
  selector: 'app-cadastro-new-user',
  templateUrl: './cadastro-new-user.component.html',
  styleUrls: ['./cadastro-new-user.component.scss']
})
export class CadastroNewUserComponent implements OnInit {
  user: User;
  masks = masks;
  confirm_password: string = null;
  successMessage: string = null;
  saving = false;
  saved = false;
  swal: any;
  usuario:any
  public success = new Subject<string>();

  constructor(
    public http: HttpClient,
    public utils: UtilsService,
    public userService: UserService,
    public router : Router
  ) { 
    this.user = this.userService.instantiateUser();
  }

  ngOnInit() {
    this.success.subscribe(message => (this.successMessage = message));
    this.userService.getUserById('0').subscribe(res=>{
      var aux:any= res
      this.usuario= aux.user_id
    },error=>{
      if(error.status == 401 || error.status == 403 ){
        localStorage.removeItem('appSaveAdd');
        this.router.navigateByUrl('/login')
      }
    })
  }

  register() {
    this.user.Cpf = this.utils.unmask(this.user.Cpf);
    console.log(this.user)
    this.saving = true;
    this.userService.registerNewUser(this.user).subscribe(
      res => {
      
            this.saving = false;
            this.saved = true;
            console.log(res)
            if (!this.successMessage) {
              this.user = this.userService.instantiateUser();
              this.confirm_password=''
              swal("Sucesso", "Cadastro realizado com Sucesso!", "success")
            }
          },
            err => {
              this.saving = false;
              swal("Erro", err.error.Mensagem, "error");
      }
    );
  }

}
