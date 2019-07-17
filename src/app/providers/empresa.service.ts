import { UtilsService } from './../shared/utils.service';
import { Telefone, Empresa } from './empresa.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVICE_API } from '../app.api';
import { AuthService } from './auth.service';

export interface Empresa {
  IdEmpresa?: string;
  IdEmpresaMatriz?: string;
  Cnpj: string;
  NomeEmpresa: string;
  RazaoSocial: string;
  InscricaoEstadual?: string;
  DataInclusao?: string;
  DataExclusao?: string;
  UsuarioExclusao?: string;
  TipoEmpresa?: number;
  StatusEmpresa?: number;
  Enderecos: Endereco[];
  Telefones: Telefone[];
  FormasPagamento: any[];
  Intencoes: any[];
  ValorPedidoMinimo: any;
  DadosBancarios: any;
  EmailFiscal: string,
}

export interface FormaPagamento {
  IdFormaPagamento?: string;
  NomeFormaPagamento?: string;
  isChecked?: boolean;
}
export interface Intencao {
  IdIntencao?: string;
  NomeIntencao?: string;
  isChecked?: boolean;
}
export interface Telefone {
  IdTelefone?: string;
  NomeTelefone?: string;
  Area: string;
  Numero: string;
  Ramal?: string;
  Pais: string;
  DataInclusao?: string | Date;
  DataExclusao?: string | Date;
  UsuarioExclusao?: string;
  StatusTelefone?: number;
}

export interface Endereco {
  IdEndereco?: string;
  NomeEndereco?: string;
  Cep: string;
  Logradouro: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Estado: string | number;
  Pais: string;
  PermiteRetirada: number;
  RealizaEntrega: number;
  DataInclusao?: string | Date;
  DataExclusao?: string | Date;
  UsuarioExclus1ao?: string;
  StatusEndereco?: number;
  Complemento?: string;
  TipoEndereco?: number;
}
export interface DadosBancarios {
  IdDadosBancarios?: string;
  IdEmpresa?: string;
  IdUsuario?: string;
  TipoDadosBancarios?: number;
  NomeDadosBancarios?: string;
  CpfCnpjTitular?: string;
  NomeBanco?: string;
  NomeTitular?: string;
  NumeroAgencia?: string;
  DigitoAgencia?: string;
  NumeroConta?: string;
  DigitoConta?: string;
  NumeroCartao?: string;
  MesValidadeCartao?: number;
  AnoValidadeCartao?: number;
  CodigoCartao?: string;
  Observacoes?: string;
  Empresa?: string;
  Usuario?: string
}

@Injectable()
export class EmpresaService {
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

  getEmpresas(show_filiais: boolean = false) {
    return this.http.get(
      SERVICE_API + '/empresas?exibirFiliais=' + show_filiais,
      { headers: this.headers }
    );
  }
  listarAnunciantes() {
    return this.http.get(
      SERVICE_API + '/empresas/ListarAnunciantes',
      { headers: this.headers }
    );
  }
  getAllEmpresas() {
    return this.http.get(
      SERVICE_API + '/empresas',
      { headers: this.headers }
    );
  }
  getFiliais(id_empresa: string) {
    return this.http.get(SERVICE_API + '/empresas/matriz/' + id_empresa, {
      headers: this.headers
    });
  }

  getEmpresaById(id: string) {
    return this.http.get(SERVICE_API + '/empresas/id/' + id, {
      headers: this.headers
    });
  }

  save(empresa: Empresa) {
    return this.http.post(SERVICE_API + '/empresas', empresa, {
      headers: this.headers
    });
  }

  update(empresa: Empresa) {
    console.log("empresa,", empresa)
    return this.http.put(SERVICE_API + '/empresas', empresa, {
      headers: this.headers
    });
  }

  delete(empresa_id: string) {
    return this.http.delete(SERVICE_API + '/empresas/' + empresa_id, {
      headers: this.headers
    });
  }

  getEstados() {
    return this.http.get(SERVICE_API + '/estados', {
      headers: this.headers
    });
  }

  searchEmpresaOnReceita(cnpj: string) {
    return this.http.get(
      this.cors_anywhere + 'https://www.receitaws.com.br/v1/cnpj/' + cnpj
    );
  }

  receitaToLocal(receita_data): Empresa {
    const empresa: Empresa = {
      NomeEmpresa:
        receita_data.fantasia != null && receita_data.fantasia.length > 0
          ? receita_data.fantasia
          : null,
      RazaoSocial:
        receita_data.nome != null && receita_data.nome.length > 0
          ? receita_data.nome
          : null,
      Cnpj: this.utils.unmask(receita_data.cnpj),
      EmailFiscal: null,
      IdEmpresaMatriz: null,
      InscricaoEstadual: null,
      Enderecos: [],
      Telefones: [],
      FormasPagamento: [],
      Intencoes: [],
      TipoEmpresa: receita_data.tipo,
      StatusEmpresa: 1,
      ValorPedidoMinimo: null,
      DadosBancarios: null
    };
    empresa.Enderecos.push({
      Cep: this.utils.unmask(receita_data.cep),
      Cidade: receita_data.municipio,
      Estado: receita_data.uf,
      Logradouro: receita_data.logradouro,
      Bairro: receita_data.bairro,
      Numero: receita_data.numero,
      Complemento: receita_data.complemento,
      Pais: 'Brasil',
      PermiteRetirada: 1,
      RealizaEntrega: 1,
      StatusEndereco: 1
    });
    const phones = receita_data.telefone.split('/');
    for (let phone of phones) {
      phone = this.utils.unmask(phone);
      empresa.Telefones.push({
        Area: phone.slice(0, 2),
        Numero: phone.slice(2, phone.length),
        Pais: 'Brasil',
        StatusTelefone: 1
      });
    }

    return empresa;
  }

  instantiateEmpresa() {
    const empresa: Empresa = {
      Cnpj: null,
      IdEmpresaMatriz: null,
      RazaoSocial: null,
      NomeEmpresa: null,
      InscricaoEstadual: null,
      TipoEmpresa: null,
      Enderecos: [],
      FormasPagamento: [],
      Intencoes: [],
      Telefones: [],
      ValorPedidoMinimo: 0,
      DadosBancarios: null,
      EmailFiscal: null,
    };
    return empresa;
  }

  instantiateTelefone() {
    const telefone: Telefone = {
      Area: null,
      Numero: null,
      Ramal: null,
      Pais: 'Brasil',
      StatusTelefone: 1
    };
    return telefone;
  }

  instantiateEndereco() {
    const endereco: Endereco = {
      Pais: 'Brasil',
      Cep: null,
      Estado: null,
      Cidade: null,
      Bairro: null,
      Logradouro: null,
      Complemento: null,
      Numero: null,
      PermiteRetirada: 1,
      RealizaEntrega: 1,
      StatusEndereco: 1
    };
    return endereco;
  }
  instatiateDadosBancarios() {
    const dadosBancarios: DadosBancarios = {
      IdDadosBancarios: null,
      IdEmpresa: null,
      IdUsuario: null,
      TipoDadosBancarios: 0,
      NomeDadosBancarios: null,
      CpfCnpjTitular: null,
      NomeBanco: null,
      NomeTitular: null,
      NumeroAgencia: null,
      DigitoAgencia: null,
      NumeroConta: null,
      DigitoConta: null,
      NumeroCartao: null,
      MesValidadeCartao: null,
      AnoValidadeCartao: null,
      CodigoCartao: null,
      Observacoes: null,
      Empresa: null,
      Usuario: null
    }
    return dadosBancarios;
  }
  instantiateFormaPagamento(id: string, nome: string) {
    const formaPagamento: FormaPagamento = {
      IdFormaPagamento: id,
      NomeFormaPagamento: nome
    };
    return formaPagamento;
  }
  instantiateIntencao(id: string, nome: string) {
    const intencao: Intencao = {
      IdIntencao: id,
      NomeIntencao: nome
    };
    return intencao;
  }
  getAddres(CEP) {
    return this.http.get('https://viacep.com.br/ws/' + CEP + '/json/');
  }

  getFormasPagamento() {
    return this.http.get(SERVICE_API + '/formasPagamento', {
      headers: this.headers
    });
  }
  getIntencoes() {
    return this.http.get(SERVICE_API + '/intencoes', {
      headers: this.headers
    });
  }

}
