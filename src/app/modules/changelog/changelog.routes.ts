import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChangeLogComponent} from './changelog.component';
import {ChangeLogDetailComponent} from './changelog.detail.component';
import {AuthGuard} from '../core/services';
import {TemplateListComponent} from '../../components/template';


export const changelogRoutes: Routes = [
  {
    path: '',
    component: ChangeLogComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'changelog', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'changelog/:id', component: ChangeLogDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(changelogRoutes) ],
  exports: [ RouterModule ]
})
export class ChangeLogRoutingModule {}
