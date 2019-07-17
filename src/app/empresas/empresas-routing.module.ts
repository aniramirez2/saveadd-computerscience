import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas.component';
import { ViewEmpresaComponent } from './view/view.component';
import { AddAddressComponent } from './add-address/add-address.component';
const routes: Routes = [
  {
    path: '',
    component: EmpresasComponent,
    children: [{ path: '', component: EmpresasComponent }]
  },
  { path: ':id', component: ViewEmpresaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule {}
