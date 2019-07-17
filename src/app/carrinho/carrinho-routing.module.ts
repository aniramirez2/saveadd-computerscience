import { CheckoutComponent } from './checkout/checkout.component';
import { CarrinhoComponent } from './carrinho.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: CarrinhoComponent },
  { path: 'pedido-realizado/:id', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrinhoRoutingModule {}
