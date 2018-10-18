import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/services/auth-guard.service';
import { CategoryComponent } from './category.component';
import { CategoryDetailComponent } from './category.detail.component';
import { TemplateListComponent } from '../../template/template-list.component';


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
