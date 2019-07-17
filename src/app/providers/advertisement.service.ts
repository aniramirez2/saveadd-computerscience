import { Advertisement, Anuncio } from './advertisement.service';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SERVICE_API } from '../app.api';
import moment from 'moment';

export interface Advertisement {
  id?: string;
  title: string;
  description: string;
  start_date: Date | string;
  end_date: Date | string;
  category: string | number;
  type: number;
  status?: number;
  products: any[];
  batches: any[];
  IdEmpresa: string;
  restrictions: AdRestriction[];
  lotes: AdLote[];
}

export interface Anuncio {
  IdAnuncio?: string;
  IdEmpresa: string;
  Titulo: string;
  Descricao: string;
  DataInicio: string | Date;
  DataFim: string | Date;
  Categoria: number;
  TipoAnuncio: number;
  DataInclusao?: string | Date;
  UsuarioInclusao?: string;
  DataExclusao?: string | Date;
  UsuarioExclusao?: string;
  StatusAnuncio?: number;
  IdSistema?: string;
  Produtos: AdProduct[];
  Restricoes: AdRestriction[];
  Lotes: AdLote[];
  Quantidade?: number;
  SubCategoria?: any;
}

export interface AdProduct {
  IdAnuncio: string;
  IdProduto: string;
  QuantidadeEstoque: number;
  Unidade: string;
  ValorUnitarioOriginal: number;
  ValorUnitarioDesconto: number;
  Detalhes: string;
  imagems?: any[];
}

export interface AdRestriction {
  IdRestricao?: string;
  Descricao?: string;
  IdAnuncio?: string;
  Valor: string;
  TpRestricao?: TipoRestricao;
  TipoRestricao: number;
}
export interface AdLote {
  IdLote?: string;
  IdAnuncio?: string;
  NumeroLote?: string;
  DataVencimento?: string;
  IdProduto: string;

}

export interface TipoRestricao {
  Id: number;
  Descricao: string;
}

@Injectable()
export class AdvertisementService {
  headers: HttpHeaders;
  restricoes: any = [
    { "Id": 1, "Descricao": "Quantidade Mínima" },
    { "Id": 2, "Descricao": "Quantidade Máxima" },
    { "Id": 3, "Descricao": "Restrito a um CNPJ" },
    { "Id": 4, "Descricao": "Restrito ao Estado" },
    { "Id": 6, "Descricao": "Restrito a ONG's" },
    { "Id": 7, "Descricao": "Restrito a ONG's Conveniadas" }
  ];
  constructor(public auth: AuthService, public http: HttpClient) {
    if (this.auth.getSessionData() != null) {
      this.headers = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + this.auth.getSessionData().token
      );
    } else {
      console.log('ajax sem autenticação')
    }

  }

  // Validação de data antes de hoje

  createAd(ad: Advertisement) {
    let type: any;
    if (ad.category === 1) {
      type = 0;
    } else {
      type = 1;
    }

    const data = {
      Titulo: ad.title,
      Descricao: ad.description,
      DataInicio: ad.start_date,
      DataFim: ad.end_date,
      Categoria: ad.category,
      TipoAnuncio: type,
      Produtos: ad.products,
      IdEmpresa: ad.IdEmpresa,
      Restricoes: ad.restrictions,
      Lotes: ad.lotes
    };


    return this.http.post(SERVICE_API + '/anuncios', data, {
      headers: this.headers
    });
  }
  vincularEndereco(data) {
    return this.http.post(SERVICE_API + '/anuncios/VincularEndereco', data, {
      headers: this.headers
    });
  }
  getAll() {
    return this.http.get(SERVICE_API + '/anuncios', { headers: this.headers });
  }

  update(anuncio: Anuncio) {
    return this.http.put(SERVICE_API + '/anuncios', anuncio, {
      headers: this.headers
    });
  }

  list() {
    return this.http.get(SERVICE_API + '/anuncios', { headers: this.headers });
  }

  vitrine() {
    return this.http.get(SERVICE_API + '/anuncios/vitrine', {
      headers: this.headers
    });
  }
  vitrineByInterest() {
    return this.http.get(SERVICE_API + '/anuncios/vitrine/?UsarMeusInteresses=true', {
      headers: this.headers
    });
  }
  vitrineByCat(id) {
    return this.http.get(SERVICE_API + '/anuncios/vitrine/?idCategoria=' + id, {
      headers: this.headers
    });
  }
  vitrineOrderBy(id) {
    var len = id.split(' ').join('');
    return this.http.get(SERVICE_API + '/anuncios/vitrine/?orderby=' + len, {
      headers: this.headers
    });
  }
  vitrineAnunciantes(id) {

    var len = id.split(' ').join('');
    return this.http.get(SERVICE_API + "/anuncios/vitrine/?idAnunciante=" + len, {
      headers: this.headers
    });
  }
  meusAnuncios() {
    return this.http.get(SERVICE_API + '/anuncios/vitrine?meusAnuncios=true', {
      headers: this.headers
    });
  }

  getAnuncioById(id: string) {
    return this.http.get(SERVICE_API + '/anuncios/id/' + id, {
      headers: this.headers
    });
  }

  removeAnuncio(id) {
    return this.http.delete(SERVICE_API + '/anuncios/' + id, {
      headers: this.headers
    })

  }

  getFormasPagamento() {
    return this.http.get(SERVICE_API + '/formasPagamento', {
      headers: this.headers
    });
  }

  instantiateAd(): Anuncio {
    return {
      IdAnuncio: null,
      IdEmpresa: null,
      Titulo: null,
      Descricao: null,
      DataInicio: null,
      DataFim: null,
      Categoria: null,
      TipoAnuncio: null,
      Produtos: [],
      Restricoes: [],
      Lotes: []
    };
  }

  instantiateProduct() {
    return {
      IdAnuncio: null,
      IdProduto: null,
      QuantidadeEstoque: null,
      Unidade: null,
      ValorUnitarioOriginal: null,
      ValorUnitarioDesconto: null,
      Detalhes: null
    };
  }

  instantiateRestricao() {
    return {
      IdAnuncio: null,
      IdRestricao: null,
      TipoRestricao: null,
      Valor: null,
      Descricao: null
    } as AdRestriction;
  }
  instantiateLote() {
    return {
      IdLote: null,
      NumeroLote: null,
      DataVencimento: null,
      IdProduto: null,
    } as AdLote;
  }

  getTipoRestricao(id) {
    this.restricoes.forEach(tipoRegistricao => {
      if (tipoRegistricao.Id === id) {
        return tipoRegistricao.Descricao;
      }
    });
  }

  getTipoRestricoes(): TipoRestricao[] {
    return [
      { "Id": 1, "Descricao": "Quantidade Mínima" },
      { "Id": 2, "Descricao": "Quantidade Máxima" },
      { "Id": 3, "Descricao": "Restrito a um CNPJ" },
      { "Id": 4, "Descricao": "Restrito ao Estado" },
      { "Id": 6, "Descricao": "Restrito a ONG's" },
      { "Id": 7, "Descricao": "Restrito a ONG's Conveniadas" }
    ];
  }
  validateRepeatedRestriction(value, array) {
    var aux
    array.forEach(element => {
      aux = array.filter(array => array['TipoRestricao'] === value)
    });
    return aux
  }
  validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    var tamanho = cnpj.length - 2
    var numeros = cnpj.substring(0, tamanho);
    var digitos = cnpj.substring(tamanho);
    var soma = 0;
    var pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;

  }
}
