import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgencyComponent } from './agency.component';
import { AgencyDetailComponent } from './agency.detail.component';
import { AuthGuard } from '../../lib/services';
import { TemplateListComponent } from '../../components/template';


export const agencyRoutes: Routes = [
  {
    path: '',
    component: AgencyComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'agencies', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'agencies/:id', component: AgencyDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(agencyRoutes)],
  exports: [RouterModule]
})
export class AgencyRoutingModule { }
