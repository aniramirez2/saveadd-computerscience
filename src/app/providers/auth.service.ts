import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVICE_API } from './../app.api';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
export interface AppSession {
  token: string;
  token_type: string;
  token_expires_in: string;
  user_id: string;
  type_user: number
  // user?: User;
}

@Injectable()
export class AuthService {
  headers: HttpHeaders;
  constructor(
    public http: HttpClient,
    public cookieService: CookieService
  ) {
    this.headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    if (this.isAuthenticated()) {
      this.headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.getSessionData().token
      );
    } else {
      console.log('ajax sem autenticação')
      this.headers = new HttpHeaders();
    }
  }

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');
    const myheader = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    return this.http.post(SERVICE_API + '/token', body.toString(), { headers: myheader });
  }
  recuperarSenha(email: string) {
    return this.http.get(SERVICE_API + '/usuarios/recupera/?email=' + email, {
      headers: this.headers
    });
  }
  enviarNovaSenha(IdUsuario: string, Token: string, NovaSenha: string) {
    const body = new URLSearchParams();
    body.set('IdUsuario', IdUsuario);
    body.set('Token', Token);
    body.set('NovaSenha', NovaSenha);
    console.log("body", body.toString())
    const data = {
      'IdUsuario':IdUsuario,
      'Token': Token,
      'NovaSenha': NovaSenha
    }
    //body.toString()
    return this.http.put(SERVICE_API + '/usuarios/recupera', data, {
      headers: this.headers
    });
  }

  saveSession(auth_response: any) {
    const appSaveAdd: AppSession = {
      token: auth_response.access_token,
      token_type: auth_response.token_type,
      token_expires_in: auth_response.expires_in,
      user_id: auth_response.IdUsuario,
      type_user: auth_response.TypeUser
    };
    localStorage.setItem('appSaveAdd', JSON.stringify(appSaveAdd));

  }

  isAuthenticated() {
    const appSaveAdd: AppSession = JSON.parse(
      localStorage.getItem('appSaveAdd')
    ) as AppSession;
    //console.log("AppSession",appSaveAdd)
    if (appSaveAdd != null) {
      return true;
    }
    return false;
  }

  logout() {
    //console.log(this.cookieService.deleteAll());
    localStorage.removeItem('appSaveAdd');

    return true;
  }
  test(){
    return this.http.put(SERVICE_API + '/tests/unauthorized',  {
      headers: this.headers
    });
  }
  getSessionData() {
    const appSession: AppSession = JSON.parse(
      localStorage.getItem('appSaveAdd')
    ) as AppSession;
    return appSession;
  }
}
