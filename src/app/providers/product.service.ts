import { Observable } from 'rxjs';
import { Fabricante, Imagem, Categoria } from './product.service';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVICE_API } from '../app.api';

export interface Product {
  id?: string;
  name: string;
  code_type: string | number;
  code: string;
  description?: string;
  category: number;
  manufacturer: string;
  codigoInterno: string;
  Fabricante: Fabricante;
  CodigoBarras: Codigo[];
  Lotes: Lote[];
}

export interface Produto {
  Categoria: number;
  IdProduto: string;
  NomeProduto: string;
  DescricaoProduto: string;
  StatusProduto: string;
  Fabricante: Fabricante;
  CodigoBarras: Codigo[];
  Lotes: Lote[];
  CodigoInterno: string
}

export interface Fabricante {
  IdFabricante?: string;
  NomeFabricante: string;
  DataInclusao?: string | Date;
  UsuarioInclusao?: string;
  DataExclusao?: string | Date;
  UsuarioExclusao?: string;
  StatusFabricante?: string;
  IdSistema?: string;
}

export interface Codigo {
  IdCodigoBarras?: string;
  Codigo: string;
  TipoCodigoBarras?: string | number;
}

export interface Lote {
  IdLote?: string;
  NumeroLote: string;
  DataVencimento?: string | Date;
  IdProduto?: string;
}

export interface Categoria {
  IdCategoria: number;
  IdCategoriaPai: number;
  NomeCategoria: string;
}

export interface Imagem {
  IdProduto: string;
  ordemImage: number;
  imagem: File;
  IdImagem?: string;
}
@Injectable()
export class ProductService {
  headers: HttpHeaders;
  constructor(public http: HttpClient, public auth: AuthService) {
    if (this.auth.getSessionData() != null) {
      this.headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.auth.getSessionData().token
      );
    } else
      console.log('ajax sem autenticação')
  }
  getCategories2() {
    return this.http.get<any[]>(SERVICE_API + '/categorias?exibirSubCategorias=true', { headers: this.headers });
  }
  getInteresses() {
    return this.http.get<any[]>(SERVICE_API + '/interesses', { headers: this.headers });
  }
  getCategories() {
    return this.http.get(SERVICE_API + '/categorias?exibirSubCategorias=true', { headers: this.headers });
  }
  getCategorieById(id: number) {
    return this.http.get(SERVICE_API + '/categorias/' + id, {
      headers: this.headers
    });
  }
  getSubCategories(id: number) {
    return this.http.get(SERVICE_API + '/categorias/' + id + "/subcategorias", {
      headers: this.headers
    });
  }

  search(term: string) {
    return this.http.get(SERVICE_API + '/produtos', { headers: this.headers });
  }

  getAll() {
    return this.http.get(SERVICE_API + '/produtos', { headers: this.headers });
  }

  getById(id: string) {
    return this.http.get(SERVICE_API + '/produtos/id/' + id, {
      headers: this.headers
    });
  }



  delete(id: string) {
    return this.http.delete(SERVICE_API + '/produtos/' + id, {
      headers: this.headers
    });
  }
  deleteImagem(id: any) {
    console.log(`id da imaem`, id)
    return this.http.post(SERVICE_API + '/produtos/imagem/excluir', id, {
      headers: this.headers
    });
  }
  getImages(id) {
    return this.http.get<Imagem[]>(SERVICE_API + '/produtos/imagem/' + id, {
      headers: this.headers
    });
  }

  uploadImagem(imagem: Imagem) {
    const formData: FormData = new FormData();
    formData.append('imagem', imagem.imagem, imagem.imagem.name);
    formData.append('idProduto', imagem.IdProduto);
    formData.append('ordemImage', String(imagem.ordemImage));
    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.headers.append('Content-Type', 'multipart/form-data');
    this.headers.append('Accept', 'application/json');
    return this.http.post(SERVICE_API + '/produtos/imagem/upload', formData, {
      headers: this.headers
    });
  }
  uploadImportacao(planilha) {
    console.log("import", planilha)
    const formData: FormData = new FormData();
    formData.append('planilha', planilha, planilha.name);
    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.headers.append('Content-Type', 'multipart/form-data');
    this.headers.append('Accept', 'application/json');
    return this.http.post(SERVICE_API + '/produtos/ImportarProdutos', formData, {
      headers: this.headers
    });
  }

  createProduct(product: Product) {
    const data: any = {
      NomeProduto: product.name,
      DescricaoProduto: product.description,
      Categoria: product.category,
      StatusProduto: 0,
      Fabricante: product.Fabricante,
      Lotes: product.Lotes,
      CodigoInterno: product.codigoInterno,
      CodigoBarras: [
        {
          Codigo: product.code,
          TipoCodigoBarras: product.CodigoBarras[0].TipoCodigoBarras
        }
      ]
    };
    return this.http.post(SERVICE_API + '/produtos', data, {
      headers: this.headers
    });
  }

  update(produto: Produto) {
    return this.http.put(SERVICE_API + '/produtos', produto, {
      headers: this.headers
    });
  }

  getFabricantes() {
    return this.http.get(SERVICE_API + '/fabricantes', {
      headers: this.headers
    });
  }

  getCodigosBarras() {
    return this.http.get(SERVICE_API + '/codigoBarras', {
      headers: this.headers
    });
  }

  getTiposCodigo() {
    return [
      { "id": 1, "nome": 'EAN 13' },
      { "id": 2, "nome": 'DUN' },
      { "id": 3, "nome": 'Data Bar' },
      { "id": 4, "nome": '128' },
      { "id": 5, "nome": 'ITF' },
      { "id": 6, "nome": 'Data Matrix' }
    ];
  }

  getNomeCategoria(id_categoria, categorias) {
    for (const categoria of categorias) {
      if (categoria.IdCategoria === id_categoria) {
        return categoria.NomeCategoria;
      }
    }
  }

  instantiateFabricante(): Fabricante {
    return {
      IdFabricante: null,
      NomeFabricante: null,
      DataInclusao: null,
      UsuarioInclusao: null,
      DataExclusao: null,
      UsuarioExclusao: null,
      StatusFabricante: null,
      IdSistema: null
    };
  }

  instantiateLote(): Lote {
    return {
      IdLote: null,
      IdProduto: null,
      DataVencimento: null,
      NumeroLote: null
    };
  }

  instantiateImagem(): Imagem {
    return {
      IdProduto: null,
      ordemImage: null,
      imagem: null
    };
  }
  instantiateCodigo(): Codigo {
    return {
      IdCodigoBarras: null,
      Codigo: null,
      TipoCodigoBarras: null
    };
  }


}
