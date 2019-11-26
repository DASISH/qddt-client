import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionConstructComponent } from './question-construct.component';
import { QuestionConstructDetailComponent } from './question-construct.detail.component';
import { AuthGuard } from '../../lib/services';
import { TemplateListComponent } from '../../components/template';


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
  imports: [RouterModule.forChild(questionConstructRoutes)],
  exports: [RouterModule]
})
export class QuestionConstructRoutingModule { }
