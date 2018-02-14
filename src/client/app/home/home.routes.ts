import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-guard.service';

import { HomeComponent } from './home.component';
import { StudyComponent } from './study/study.component';
import { ConceptComponent } from './concept/concept.component';
import { SurveyComponent } from './survey/survey.component';
import { TopicComponent } from './topic/topic.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', redirectTo: 'survey', canActivate: [AuthGuard]},
      { path: 'survey', component: SurveyComponent, canActivate: [AuthGuard],},
      { path: 'study', component: StudyComponent, canActivate: [AuthGuard]},
      { path: 'topic', component: TopicComponent, canActivate: [AuthGuard]},
      { path: 'concept', component: ConceptComponent, canActivate: [AuthGuard]}],
    }
];

@NgModule({
  imports: [ RouterModule.forChild(homeRoutes) ],
  exports: [ RouterModule ]
})
export class HomeRoutingModule {}
