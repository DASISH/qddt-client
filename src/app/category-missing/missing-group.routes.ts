import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-guard.service';
import { TemplateListComponent } from '../template/template-list.component';
import { MissingGroupComponent } from './missing-group.component';
import { MissingGroupDetailComponent } from './missing-group.detail.component';


export const missingCategoryRoutes: Routes = [
  {
    path: '',
    component: MissingGroupComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'schemes', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'schemes/:id', component: MissingGroupDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(missingCategoryRoutes) ],
  exports: [ RouterModule ]
})
export class MissingGroupRoutingModule {}
