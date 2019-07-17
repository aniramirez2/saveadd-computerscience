import { masks } from './../masks';
import { AlterarSenhaComponent } from './../alterar-senha/alterar-senha.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../providers/auth.service';
import { UserService, User } from './../providers/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  user: User;
  password: string = null;
  password_confirmation: string = null;
  public success = new Subject<string>();
  successMessage: string;
  full_name: string = '';
  updating = false;
  loading_page = false;
  masks = masks;
  constructor(
    public userService: UserService,
    public auth: AuthService,
    public router: Router,
    public datepipe: DatePipe,
    public modalService: NgbModal
  ) {}

  ngOnInit() {
    const user_id = this.auth.getSessionData().user_id;
    this.loading_page = true;
    this.userService.getUserById(user_id).subscribe(
      res => {
        this.loading_page = false;
        const user_data: any = res;
        const localDate = new Date(user_data.DataNascimento);
        const localTime = localDate.getTime();
        const localOffset = localDate.getTimezoneOffset() * 60000;
        this.user = {
          IdUsuario: user_id,
          NomeUsuario: user_data.NomeUsuario,
          Cpf: user_data.Cpf,
          DataNascimento: new Date(localTime + localOffset),
          Email: user_data.Email
        };
        this.full_name = user_data.NomeUsuario;
      },
      error => {
        this.loading_page = false;
        if(error.status == 401 || error.status == 403 ){
          localStorage.removeItem('appSaveAdd');
          this.router.navigateByUrl('/login')
        }
      }
    );

    this.success
      .pipe(debounceTime(4000))
      .subscribe(() => (this.successMessage = null));
    this.success.subscribe(message => (this.successMessage = message));
  }

  updateName(value) {
    this.user.NomeUsuario = value;
    this.full_name = value;
    console.log(this.user);
  }

  updateData() {
    this.updating = true;
    this.user.DataNascimento = this.datepipe.transform(
      this.user.DataNascimento,
      'yyyy-MM-dd'
    );
    this.userService.update(this.user).subscribe(
      res => {
        this.updating = false;
        swal("Sucesso", "Dados atualizados com sucesso!", "success")
        //this.success.next('Dados atualizados com sucesso');
      },
      error => {
        this.updating = false;
        swal("Erro", error.Message, "error")
      }
    );
  }

  openAlterarSenhaModal() {
    const modalRef = this.modalService.open(AlterarSenhaComponent);
    modalRef.componentInstance.user_id = this.user.IdUsuario;
  }
}
