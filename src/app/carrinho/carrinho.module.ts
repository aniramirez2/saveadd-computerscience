import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {LOCALE_ID} from '@angular/core';
import { CarrinhoRoutingModule } from './carrinho-routing.module';
import { CarrinhoComponent } from './carrinho.component';
import { CarrinhoService } from '../providers/carrinho.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  imports: [CommonModule,NgxSpinnerModule, CarrinhoRoutingModule, FormsModule, NgbModule, SharedModule, CurrencyMaskModule],
  declarations: [CarrinhoComponent, CheckoutComponent, DetalhesProdutoComponent],
  providers: [CarrinhoService,NgxSpinnerService, {
    provide: LOCALE_ID,
    useValue: "pt-BR"
  }],
  entryComponents: [DetalhesProdutoComponent],
})
export class CarrinhoModule {}
registerLocaleData(localePt);