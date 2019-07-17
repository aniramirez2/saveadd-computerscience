import { UtilsService } from '../shared/utils.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_API } from '../app.api';
import { AuthService } from './auth.service';



export interface Categoria {
  IdCategoria: string;
  NomeCategoria: string;
  IdCategoriaPai: any;
}
export interface AddCategoria {
  IdCategoria: any;
  NomeCategoria: string;
  IdCategoriaPai: any;
}
export interface Intencao {
  IdIntencao?: string;
  NomeIntencao?: string;
  isChecked?: boolean;
}
@Injectable()
export class TecnicoAdminService {
  headers: HttpHeaders;
  cors_anywhere = 'https://cors-anywhere.herokuapp.com/';
  constructor(
    public http: HttpClient,
    public auth: AuthService,
    public utils: UtilsService
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



  getAllCategorias() {
    return this.http.get(
      SERVICE_API + '/categorias',
      { headers: this.headers }
    );
  }
  saveCategoria(categoria: AddCategoria) {
    return this.http.post(SERVICE_API + '/categorias', categoria, {
      headers: this.headers
    });
  }
  updateCategoria(categoria: AddCategoria) {
    return this.http.put(SERVICE_API + '/categorias', categoria, {
      headers: this.headers
    });
  }
  deleteCategoria(categoria_id: string) {
    return this.http.delete(SERVICE_API + '/categorias/' + categoria_id, {
      headers: this.headers
    });
  }

  getCategoriaById(id: string) {
    return this.http.get(SERVICE_API + '/categorias/id/' + id, {
      headers: this.headers
    });
  }


  instantiateCategoria() {
    const categoria: Categoria = {
      IdCategoria: null,
      NomeCategoria: null,
      IdCategoriaPai: 0
    };
    return categoria;
  }
  instantiateAddCategoria() {
    const categoria: AddCategoria = {
      IdCategoria: null,
      NomeCategoria: null,
      IdCategoriaPai: 0
    };
    return categoria;
  }
  instantiateIntencao(id: string, nome: string) {
    const intencao: Intencao = {
      IdIntencao: id,
      NomeIntencao: nome
    };
    return intencao;
  }
  getIntencoes() {
    return this.http.get(SERVICE_API + '/intencoes', {
      headers: this.headers
    });
  }

}
