import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { AuthGuard} from '../../lib/services';
import { TemplateListComponent} from '../../components/template';


export const categoryRoutes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'categories', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'categories/:id', component: CategoryDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(categoryRoutes) ],
  exports: [ RouterModule ]
})
export class CategoryRoutingModule {}
