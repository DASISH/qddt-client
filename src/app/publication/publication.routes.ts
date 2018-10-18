import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/services/auth-guard.service';
import { PublicationComponent } from './publication.component';
import { PublicationDetailComponent } from './publication.detail.component';
import {TemplateListComponent} from '../template/template-list.component';


export const publicationRoutes: Routes = [
  {
    path: '',
    component: PublicationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'publications', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'publications/:id', component: PublicationDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(publicationRoutes) ],
  exports: [ RouterModule ]
})
export class PublicationRoutingModule {}
