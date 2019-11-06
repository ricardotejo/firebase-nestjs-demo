import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';


const routes: Routes = [
  { path: '', component: ClientDashboardComponent },

  // es
  { path: 'clientes', component: ClientListComponent },
  { path: 'clientes/nuevo', component: ClientEditComponent },
  { path: 'clientes/:id', component: ClientEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
