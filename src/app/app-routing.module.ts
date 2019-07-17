import { LoginRecuperacaoComponent } from './login-recuperacao/login-recuperacao.component';
import { AnunciosModule } from './anuncios/anuncios.module';
import { AnunciosComponent } from './anuncios/anuncios.component';
import { GuardService } from './providers/guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroNewUserComponent } from './cadastro-new-user/cadastro-new-user.component';
import { CadUserComponent } from './cad-user/cad-user.component';
import { LoginComponent } from './login/login.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ComprasComponent } from './compras/compras.component';
import { VendasComponent } from './vendas/vendas.component';
import { VendaViewComponent } from './venda-view/venda-view.component';
import { PedidoViewComponent } from './pedido-view/pedido-view.component';
import { ImportacaoComponent } from './importacao/importacao.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { LoginSenhaComponent } from './login-senha/login-senha.component'
import { VitrineComponent} from './vitrine/vitrine.component'
import { LazyModule } from 'lazy-module';
import { VitrineModule} from './vitrine/vitrine.module'
import { EmpresasModule } from './empresas/empresas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProdutosModule } from './produtos/produtos.module';
import { CarrinhoModule } from './carrinho/carrinho.module';
const routes: Routes = [
  { path: '', component: LoginComponent},
  
  {
    path: 'recuperar-senha', component: LoginRecuperacaoComponent
   },
   
  { path: 'admin', 
    loadChildren: 'app/Admin/admin.module#AdminModule'
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    //loadChildren: () => DashboardModule,
    loadChildren: 'app/vitrine/vitrine.module#VitrineModule',
    //component: VitrineComponent,
  },
  { 
    path: 'cadastro-usuario',
    component: CadUserComponent
  },
  {
    path: 'new-usuario',
    component: CadastroNewUserComponent,
    canActivate: [GuardService]
  },
  {
    path: 'editar',
    component: EditarUsuarioComponent,
    canActivate: [GuardService]
  },
  {
    path: 'anuncios',
    //loadChildren: () => AnunciosModule,
    loadChildren: 'app/anuncios/anuncios.module#AnunciosModule',
    canActivate: [GuardService]
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [GuardService]
  },
  { 
    path: 'compras',
    component: ComprasComponent,
    canActivate: [GuardService]
  },
  { 
    path: 'vendas',
    component: VendasComponent,
    canActivate: [GuardService]
  },

  {
    path: 'venda-view',
    component: VendaViewComponent,
    canActivate: [GuardService]
  },
  {
    path: 'pedido-view',
    component: PedidoViewComponent,
    canActivate: [GuardService]
  },
  {
    path: 'importacao',
    component: ImportacaoComponent,
    canActivate: [GuardService]
  },
  {
    path: 'empresas',
    //loadChildren: () => EmpresasModule,
    loadChildren: 'app/empresas/empresas.module#EmpresasModule',
    canActivate: [GuardService]
  },
  {
    path: 'vitrine',
    //loadChildren: () => VitrineModule
    loadChildren: 'app/vitrine/vitrine.module#VitrineModule'
    // canActivate: [GuardService]
  },
  {
    path: 'produtos',
    //loadChildren: () => ProdutosModule,
    loadChildren: 'app/produtos/produtos.module#ProdutosModule'
    // canActivate: [GuardService]
  },
  {
    path: 'carrinho',
    //loadChildren: () => CarrinhoModule,
    loadChildren: 'app/carrinho/carrinho.module#CarrinhoModule',
    canActivate: [GuardService]
  },
  /*{
    path: 'login',
    //loadChildren: () => CarrinhoModule,
    component: LoginComponent,
    canActivate: [GuardService]
  },*/
  {
    path: 'recuperarSenha', component: LoginSenhaComponent
   },
  { path: '**', redirectTo: '/vitrine' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
