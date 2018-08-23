import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-guard.service';
import { UserComponent } from './user.component';
import { UserDetailComponent } from './user.detail.component';
import { TemplateListComponent } from '../template/template-list.component';


export const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'user/:id', component: UserDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {}