import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/services/auth-guard.service';
import { TemplateListComponent } from '../template/template-list.component';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';


export const questionRoutes: Routes = [
  {
    path: '',
    component: QuestionComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'questionitems', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'questionitems/:id', component: QuestionDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(questionRoutes) ],
  exports: [ RouterModule ]
})
export class QuestionRoutingModule {}
