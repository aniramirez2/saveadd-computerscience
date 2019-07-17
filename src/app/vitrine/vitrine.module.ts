import { CarrinhoService } from './../providers/carrinho.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VitrineRoutingModule } from './vitrine-routing.module';
import { VitrineComponent } from './vitrine.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {LOCALE_ID} from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    VitrineRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgSelectModule
  ],
  declarations: [VitrineComponent, DetalhesComponent],
  providers: [CarrinhoService,
    {
      provide: LOCALE_ID,
      useValue: "pt-BR"
    }],
  entryComponents: [DetalhesComponent]
})
export class VitrineModule {}
registerLocaleData(localePt);