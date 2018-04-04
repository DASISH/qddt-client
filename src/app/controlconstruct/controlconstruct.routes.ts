import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-guard.service';
import { ControlConstructComponent } from './controlconstruct.component';

import { QuestionConstructListComponent } from './question/questionconstruct-list.component';
import { QuestionConstructDetailComponent } from './question/questionconstruct.detail.component';
import { SequenceConstructListComponent } from './sequence/sequenceconstruct-list.component';
import { SequenceDetailComponent } from './sequence/sequenceconstruct.detail.component';


export const controlConstructRoutes: Routes = [
  {
    path: 'constructs',
    component: ControlConstructComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'questions', component: QuestionConstructListComponent, canActivate: [AuthGuard], },
      { path: 'questions/:id', component: QuestionConstructDetailComponent, canActivate: [AuthGuard], },
      { path: 'sequences', component: SequenceConstructListComponent, canActivate: [AuthGuard], },
      { path: 'sequences/:id', component: SequenceDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(controlConstructRoutes) ],
  exports: [ RouterModule ]
})
export class ControlConstructRoutingModule {}
