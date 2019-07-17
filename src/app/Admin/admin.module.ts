import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routing-module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { DeferimentoCadastralComponent } from './deferimento-cadastral/deferimento-cadastral.component'
import { ResponsabilidadeTecnicaComponent } from './responsabilidade-tecnica/responsabilidade-tecnica.component'
import { PedidosComponent } from './pedidos/Lista/pedidos.component'
import { OngsComponent } from './ongs/Lista/ongs.component'
import { DetalheOngComponent } from './ongs/Detalhe/detalheo.component'
import { AdminComponent } from './admin.component'
import { ErrosComponent } from './erros/erros.component'
import { AtividadesComponent } from './atividades/atividades.component'
import { DetalheComponent } from './pedidos/Detalhe/detalhe.component'
import { TecnicoAdminService } from './../providers/tecnicoAdmin.service'
import { SharedModule } from '../shared/shared.module'
import { AdminService} from '../providers/admin.service'
import { NgxSpinnerModule } from 'ngx-spinner';
import { DetalheDeferimentoComponent } from './deferimento-cadastral/detalhedef/detalhedef.component'
@NgModule({
  declarations: [
    DeferimentoCadastralComponent,
    ResponsabilidadeTecnicaComponent,
    PedidosComponent,
    AdminComponent,
    DetalheComponent,
    OngsComponent,
    DetalheOngComponent,
    DetalheDeferimentoComponent,
    ErrosComponent,
    AtividadesComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    NgbModule,
    FormsModule,
    TextMaskModule,
    SharedModule,
    NgxSpinnerModule
  ],
  
  providers: [
    TecnicoAdminService,
    AdminService
  ],
})
export class AdminModule {}
