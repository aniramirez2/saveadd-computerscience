import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { PedidosService } from '../providers/pedidos.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, NgbModule],
  providers: [PedidosService],
  declarations: [DashboardComponent]
})
export class DashboardModule {}
