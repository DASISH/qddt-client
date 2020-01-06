import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorComponent } from './author.component';
import { AuthorDetailComponent } from './author.detail.component';
import { AuthGuard} from '../../lib/services';
import { TemplateListComponent} from '../../components/template';


export const authorRoutes: Routes = [
  {
    path: '',
    component: AuthorComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'authors', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'authors/:id', component: AuthorDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(authorRoutes) ],
  exports: [ RouterModule ]
})
export class AuthorRoutingModule {}
