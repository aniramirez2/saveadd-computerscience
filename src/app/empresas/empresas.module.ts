import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './empresas.component';
import { EmpresaService } from '../providers/empresa.service';
import { ViewEmpresaComponent } from './view/view.component';
import { CreateEmpresaComponent } from './create-empresa/create-empresa.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RemoveEmpresaComponent } from './remove-empresa/remove-empresa.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AddPhoneComponent } from './add-phone/add-phone.component';
import { AddAddressComponent } from './add-address/add-address.component';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    NgbModule,
    FormsModule,
    TextMaskModule,
    SharedModule,
    CurrencyMaskModule,
    NgSelectModule
  ],
  declarations: [
    EmpresasComponent,
    ViewEmpresaComponent,
    CreateEmpresaComponent,
    RemoveEmpresaComponent,
    AddPhoneComponent,
    AddAddressComponent
  ],
  providers: [EmpresaService],
  entryComponents: [
    CreateEmpresaComponent,
    RemoveEmpresaComponent,
    AddPhoneComponent,
    AddAddressComponent
  ]
})
export class EmpresasModule {}
