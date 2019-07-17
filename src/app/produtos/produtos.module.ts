import { FormsModule } from '@angular/forms';
import { NovoProdutoComponent } from './novo-produto/novo-produto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdutosRoutingModule } from './produtos-routing.module';
import { ProdutosComponent } from './produtos.component';
import { SharedModule } from '../shared/shared.module';
import { ProductService } from '../providers/product.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewProdutoComponent } from './view/view.component';
import { RemoveProdutoComponent } from './remove-produto/remove-produto.component';
import { AddImageComponent } from './add-image/add-image.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
@NgModule({
  imports: [
    CommonModule,
    ProdutosRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ],
  declarations: [
    ProdutosComponent,
    NovoProdutoComponent,
    ViewProdutoComponent,
    RemoveProdutoComponent,
    AddImageComponent
  ],
  providers: [ProductService],
  entryComponents: [RemoveProdutoComponent, AddImageComponent]
})
export class ProdutosModule {}
