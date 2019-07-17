import { Empresa } from './empresa.service';
import { User } from './user.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { SERVICE_API } from '../app.api';

export interface User {
  IdUsuario?: string;
  NomeUsuario: string;
  Cpf: string;
  Email: string;
  DataNascimento: string | Date;
  Senha?: string;
  Interesses?: any[];
  DataInclusao?: string | Date;
  DataExclusao?: string | Date;
  TokenValidacao?: string;
  DataLimiteValidacao?: string;
  TipoUsuario?: number;
  StatusUsuario?: number;
  Enderecos?: EnderecoUser[];
  Telefones?: TelefoneUser[];
}
export interface EnderecoUser {
  IdEndereco?: string;
  NomeEndereco?: string;
  Cep: string;
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Estado: string | number;
  Pais?: string;
  RecebeEntrega?: number;
  RealizaEntrega?: number;
  DataInclusao?: string | Date;
  DataExclusao?: string | Date;
  UsuarioExclus1ao?: string;
  StatusEndereco?: number;
  Complemento?: string;
  TipoEndereco?: number;
}
export interface TelefoneUser {
  IdTelefone?: string;
  NomeTelefone?: string;
  Area: string;
  Numero: string;
  Ramal?: string;
  Pais?: string;
  DataInclusao?: string | Date;
  DataExclusao?: string | Date;
  UsuarioExclusao?: string;
  StatusTelefone?: number;
}

@Injectable()
export class UserService {
  headers: HttpHeaders;
  constructor(public http: HttpClient, public auth: AuthService) {
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

  getUserById(id: string) {
    return this.http.get(
      SERVICE_API + '/usuarios/' + this.auth.getSessionData().user_id,
      { headers: this.headers }
    );
  }
  getUserById2(id: string) {
    return this.http.get(
      SERVICE_API + '/usuarios/' + id,
      { headers: this.headers }
    );
  }
  getAllUser() {
    return this.http.get(
      SERVICE_API + '/usuarios/',
      { headers: this.headers }
    );
  }
  store(user: User) {
    return this.http.post(SERVICE_API + '/usuarios', { user });
  }

  register(empresa: Empresa, user: User) {
    return this.http.post(SERVICE_API + '/cadastros', {
      Empresa: empresa,
      Usuario: user
    });
  }

  registerNewUser(user) {
    return this.http.post(SERVICE_API + '/usuarios', user,
      { headers: this.headers }
    );
  }

  update(user: User) {
    const data: any = {};
    user.Senha ? (data.Senha = user.Senha) : (user.Senha = null);
    return this.http.put(SERVICE_API + '/usuarios', user, {
      headers: this.headers
    });
  }

  updatePassword(user_id: string, password: string) {
    return this.http.put(
      SERVICE_API + '/usuarios/senha',
      { IdUsuario: user_id, Senha: password },
      { headers: this.headers }
    );
  }

  instantiateUser() {
    const user: User = {
      IdUsuario: null,
      NomeUsuario: null,
      Cpf: null,
      DataNascimento: null,
      Email: null,
      Senha: null,
      Interesses: []
    };
    return user;
  }
  instantiateEndereco() {
    const endereco: EnderecoUser = {
      Pais: 'Brasil',
      Cep: null,
      Estado: null,
      Cidade: null,
      Bairro: null,
      Logradouro: null,
      Complemento: null,
      Numero: null,
      RecebeEntrega: null,
      RealizaEntrega: null,
      StatusEndereco: 1
    };
    return endereco;
  }
  instantiateTelefone() {
    const telefone: TelefoneUser = {
      Area: null,
      Numero: null,
      Ramal: null,
      Pais: 'Brasil',
      StatusTelefone: 1
    };
    return telefone;
  }
}
