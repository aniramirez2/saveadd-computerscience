import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeferimentoCadastralComponent } from './deferimento-cadastral/deferimento-cadastral.component';
import { ResponsabilidadeTecnicaComponent } from './responsabilidade-tecnica/responsabilidade-tecnica.component';
import { PedidosComponent } from './pedidos/Lista/pedidos.component'
import { OngsComponent } from './ongs/Lista/ongs.component'
import { ErrosComponent } from './erros/erros.component'
import { AtividadesComponent } from './atividades/atividades.component'
import { DetalheOngComponent } from './ongs/Detalhe/detalheo.component'
import { DetalheDeferimentoComponent } from './deferimento-cadastral/detalhedef/detalhedef.component'
import { AdminComponent } from './admin.component'
import { DetalheComponent } from './pedidos/Detalhe/detalhe.component'
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { 
        path: '', 
        component: PedidosComponent
       },
       
      ]
  },
  { path: 'detalhe', 
    component: DetalheComponent 
  },
  { 
    path: 'deferimento', 
    component: DeferimentoCadastralComponent,    
  },
  { 
    path: 'categorias', 
    component: ResponsabilidadeTecnicaComponent,
  },
  { 
    path: 'ongs', 
    component: OngsComponent,
  },
  { 
    path: 'usuarios', 
    component: OngsComponent,
  },
  { 
    path: 'detalheOng', 
    component: DetalheOngComponent,
  },
  { 
    path: 'detalheDeferimento', 
    component: DetalheDeferimentoComponent,
  },
  { 
    path: 'logerros', 
    component: ErrosComponent,
  },
  { 
    path: 'logatividades', 
    component: AtividadesComponent,
  },
  { 
    path: 'pedidos', 
    component: PedidosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
