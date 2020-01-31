import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferencedComponent } from './referenced.component';
import { ReferencedDetailComponent } from './referenced.detail.component';
import { AuthGuard } from '../../lib/services';
import { TemplateListComponent } from '../../components/template';


export const referencedRoutes: Routes = [
  {
    path: '',
    component: ReferencedComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'referenced', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'referenced/:id', component: ReferencedDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(referencedRoutes)],
  exports: [RouterModule]
})
export class ReferencedRoutingModule { }
