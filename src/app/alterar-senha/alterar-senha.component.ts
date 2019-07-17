import { Subject } from 'rxjs/Subject';
import { UserService } from './../providers/user.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {
  password: string = null;
  password_confirmation: string = null;
  user_id: string = null;
  successMessage: string = null;
  updated = false;
  private success = new Subject<string>();

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.success
      .pipe(debounceTime(4000))
      .subscribe(() => this.activeModal.close());
    this.success.subscribe(message => (this.successMessage = message));
  }
  updatePassword() {
    if (this.password) {
      this.userService
        .updatePassword(this.user_id, this.password)
        .subscribe(res => {
          this.updated = true;
          if (!this.successMessage) {
            this.success.next('Dados atualizados com sucesso!');
          }
        });
    }
  }
}
