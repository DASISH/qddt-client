import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-guard.service';
import { TemplateListComponent } from '../template/template-list.component';
import { QuestionConstructDetailComponent } from './question-construct.detail.component';
import { QuestionConstructComponent } from './question-construct.component';


export const questionConstructRoutes: Routes = [
  {
    path: '',
    component: QuestionConstructComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'questions', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'questions/:id', component: QuestionConstructDetailComponent, canActivate: [AuthGuard], },
      ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(questionConstructRoutes) ],
  exports: [ RouterModule ]
})
export class QuestionConstructRoutingModule {}
