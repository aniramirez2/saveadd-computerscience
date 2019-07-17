import { AuthService } from './auth.service';
import { SERVICE_API } from './../app.api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Anuncio } from './advertisement.service';

@Injectable()
export class CarrinhoService {
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

  adicionaCarrinho(anuncio: Anuncio) {
    let carrinho = this.getCarrinho();
    if (!carrinho) {
      carrinho = [];
    }/*
    let novo = true;
    for (let i = 0; i < carrinho.length; i++) {
      if (anuncio.IdAnuncio === carrinho[i].IdAnuncio) {
        carrinho[i].Quantidade = carrinho[i].Quantidade ? carrinho[i].Quantidade + 1 : 1;
        novo = false;
      }
    }
    if (novo) {
      carrinho.push(anuncio);
    }*/
    carrinho.push(anuncio)
    this.storeCarrinho(carrinho);
  }

  removeDoCarrinho(index) {
    let carrinho = this.getCarrinho();
    carrinho.splice(index, 1)
    /*carrinho = carrinho.filter(obj => {
      return obj.IdAnuncio !== anuncio.IdAnuncio;
    });*/
    this.storeCarrinho(carrinho);
  }

  getCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho'));
  }

  saveCarrinhoCheckout(checkoutItems) {
    localStorage.setItem('carrinho_checkout', JSON.stringify(checkoutItems));
  }

  getCarrinhoCheckout() {
    return JSON.parse(localStorage.getItem('carrinho_checkout'));
  }

  checkout(pedido) {
    return this.http.post(SERVICE_API + '/pedidos', pedido, {
      headers: this.headers
    });
  }
  checkoutmulti(pedidos) {
    return this.http.post(SERVICE_API + '/pedidos/multi', pedidos, {
      headers: this.headers
      
    });
  }
  storeCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  countCarrinhoItems() {

    const carrinho = this.getCarrinho();
    var cont = 0;
    carrinho.forEach(element => {
      if (Array.isArray(element)) {
        cont += element.length
      } else {
        cont += 1
      }
    });
    return cont
    //return carrinho ? carrinho.length : 0;
  }

  getFormasPagamento() {
    return this.http.get(SERVICE_API + '/formasPagamento', {
      headers: this.headers
    });
  }
}
