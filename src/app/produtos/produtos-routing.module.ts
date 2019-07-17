import { ViewProdutoComponent } from './view/view.component';
import { GuardService } from './../providers/guard.service';
import { ProdutosComponent } from './produtos.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NovoProdutoComponent } from './novo-produto/novo-produto.component';

const routes: Routes = [
  { path: '', component: ProdutosComponent },
  {
    path: 'novo',
    component: NovoProdutoComponent,
    canActivate: [GuardService]
  },
  {
    path: 'view/:id',
    component: ViewProdutoComponent,
    canActivate: [GuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdutosRoutingModule {}
