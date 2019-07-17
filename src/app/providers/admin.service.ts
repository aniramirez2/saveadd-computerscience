import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVICE_API } from './../app.api';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service'

@Injectable()
export class AdminService {
  headers: HttpHeaders;
  constructor(
    public http: HttpClient,
    public cookieService: CookieService,
    public auth: AuthService
  ) {
    if (this.auth.isAuthenticated()) {
      this.headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.auth.getSessionData().token
      );
    } else {
      console.log('ajax sem autenticação')
      this.headers = new HttpHeaders();
    }
  }
  listarDeferimentoPrefeitura() {
    return this.http.get(SERVICE_API + '/prefeitura/ListarDeferimentos', {
      headers: this.headers
    });
  }
  listarAtividades() {
    return this.http.get(SERVICE_API + '/admin/ListarAtividades', {
      headers: this.headers
    });
  }
  listarErros() {
    return this.http.get(SERVICE_API + '/admin/ListarErros', {
      headers: this.headers
    });
  }
  atualizarErros(erro) {
    return this.http.put(SERVICE_API + '/admin/AtualizarLogErro', erro, {
      headers: this.headers
    });
  }
  atualizarDeferimentoPrefeitura(deferimento) {
    return this.http.put(SERVICE_API + '/prefeitura/AtualizarStatusDeferimento', deferimento, {
      headers: this.headers
    });
  }
  listarDeferimento() {
    return this.http.get(SERVICE_API + '/admin/ListarDeferimentos', {
      headers: this.headers
    });
  }
  atualizarDeferimento(deferimento) {
    return this.http.put(SERVICE_API + '/admin/AtualizarStatusDeferimento', deferimento, {
      headers: this.headers
    });
  }
  getPedidos() {
    return this.http.get(SERVICE_API + '/admin/ListarPedidos', {
      headers: this.headers
    });
  }
  getUsuariosEmpresa(id) {
    return this.http.get(SERVICE_API + '/admin/ListarUsuariosEmpresa?idEmpresa=' + id, {
      headers: this.headers
    });
  }

}
