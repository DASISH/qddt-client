import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { AuthGuard} from '../../lib/services';
import { TemplateListComponent} from '../../components/template';
import { MissingComponent } from '../category-missing/missing.component';


export const questionRoutes: Routes = [
  {
    path: '',
    component: QuestionComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'questionitems', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'questionitems/:id', component: QuestionDetailComponent, canActivate: [AuthGuard], },
      { path: 'missing', outlet: 'popup', component: MissingComponent, canActivate: [AuthGuard], },

    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(questionRoutes) ],
  exports: [ RouterModule ]
})
export class QuestionRoutingModule {}
