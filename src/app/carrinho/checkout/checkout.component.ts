import { CarrinhoService } from './../../providers/carrinho.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  formas_pagamento: any;
  forma_pagamento: any;
  numero_pedido: string;
  constructor(public service: CarrinhoService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.numero_pedido = params['id'];

   });
  }
}
