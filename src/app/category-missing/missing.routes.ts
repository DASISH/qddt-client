import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/services/auth-guard.service';
import { MissingComponent } from './missing.component';
import { MissingDetailComponent } from './missing.detail.component';
import { TemplateListComponent } from '../template/template-list.component';


export const missingRoutes: Routes = [
  {
    path: '',
    component: MissingComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'missing', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'missing/:id', component: MissingDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(missingRoutes) ],
  exports: [ RouterModule ]
})
export class MissingRoutingModule {}
