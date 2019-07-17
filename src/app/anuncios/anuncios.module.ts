import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnunciosRoutingModule } from './anuncios-routing.module';
import { AnunciosComponent } from './anuncios.component';
import { NovoComponent } from './novo/novo.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AdvertisementService } from '../providers/advertisement.service';
import { EditarComponent } from './editar/editar.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RemoveProductComponent } from './remove-product/remove-product.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from "ng2-currency-mask";
import {NgxPaginationModule} from 'ngx-pagination';
@NgModule({
  imports: [
    CommonModule,
    AnunciosRoutingModule,
    FormsModule,
    NgbModule,
    SharedModule,
    TextMaskModule,
    CurrencyMaskModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  declarations: [
    AnunciosComponent,
    NovoComponent,
    EditarComponent,
    AddProductComponent,
    RemoveProductComponent
  ],
  providers: [AdvertisementService],
  entryComponents: [RemoveProductComponent, AddProductComponent]
})
export class AnunciosModule {}
