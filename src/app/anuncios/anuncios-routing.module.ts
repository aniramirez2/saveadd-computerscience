import { EditarComponent } from './editar/editar.component';
import { AnunciosComponent } from './anuncios.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NovoComponent } from './novo/novo.component';

const routes: Routes = [
  { path: '', component: AnunciosComponent },
  { path: 'novo', component: NovoComponent },
  { path: 'edit/:id', component: EditarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnunciosRoutingModule {}
