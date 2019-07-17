import { MinDigitsPipe } from './min-digits.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import {CodigoBarras } from './codigo-barras.pipe'
import {TipoRestricao} from './tipo-restricao.pipe'
@NgModule({
  imports: [CommonModule],
  declarations: [MinDigitsPipe, LoaderComponent,CodigoBarras,TipoRestricao],
  exports: [MinDigitsPipe, LoaderComponent,CodigoBarras,TipoRestricao]
})
export class SharedModule {}
