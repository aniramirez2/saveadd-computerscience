import { SERVICE_API } from './../app.api';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';
import { AuthService } from './auth.service';

export interface StatusPedido {
  Id?: number;
  Descricao?: string;
}

@Injectable()
export class PedidosService {
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

  getPedidos() {
    return this.http.get(SERVICE_API + '/pedidos', { headers: this.headers });
  }
  getPedidosOng() {
    return this.http.get(SERVICE_API + '/prefeitura/ListarPedidosOngs', { headers: this.headers });
  }
  getOngs() {
    return this.http.get(SERVICE_API + '/prefeitura/ListarOngs', { headers: this.headers });
  }
  getUsuariosOngs(id: string) {
    return this.http.get(SERVICE_API + '/prefeitura/ListarUsuariosOng/' + id, { headers: this.headers });
  }
  getRecibo(id: string) {
    return this.http.get(SERVICE_API + '/pedidos/recibo/' + id, {
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    })
  }

  getViewPedido(id: string) {
    return this.http.get(SERVICE_API + '/pedidos/id/' + id, { headers: this.headers })
  }

  getVendas(idEmpresa: string) {
    return this.http.get(SERVICE_API + '/pedidos/vendas?idEmpresa=' + idEmpresa, { headers: this.headers })
  }

  getAllVendas() {
    return this.http.get(SERVICE_API + '/pedidos/vendas', { headers: this.headers })
  }


  update(pedido) {
    return this.http.put(SERVICE_API + '/pedidos/status', pedido, {
      headers: this.headers
    });
  }

  getStatusPedidos(): StatusPedido[] {
    return [
      { Id: 0, Descricao: "Em Processamento" },
      { Id: 1, Descricao: "Aprovado" },
      { Id: 2, Descricao: "Faturado" },
      { Id: 3, Descricao: "Entregue" },
      { Id: 4, Descricao: "Negado" },
      { Id: 5, Descricao: "Cancelado" },
      { Id: 6, Descricao: "Aguardando Pagamento" },
      { Id: 7, Descricao: "Despachado" },
      { Id: 8, Descricao: "Liberado" },
      { Id: 9, Descricao: "Pagamento Aprovado" }
    ];
  }



}
