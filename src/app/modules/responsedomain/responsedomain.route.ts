import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponseDetailComponent } from './responsedomain.detail.component';
import { ResponseComponent } from './responsedomain.component';
import { AuthGuard} from '../core/services';
import { TemplateListComponent} from '../../components/template';


export const responseRoutes: Routes = [
  {
    path: '',
    component: ResponseComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'responsedomains', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'responsedomains/:id', component: ResponseDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(responseRoutes) ],
  exports: [ RouterModule ]
})
export class ResponseRoutingModule {}
