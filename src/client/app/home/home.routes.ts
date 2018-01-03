import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { HomeComponent } from './home.component';
import { StudyComponent } from './study/study.component';
import { ConceptComponent } from './concept/concept.component';
import { SurveyComponent } from './survey/survey.component';
import { TopicComponent } from './topic/topic.component';

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
          { path: 'concept', component: ConceptComponent},
          { path: 'study', component: StudyComponent},
          { path: 'survey', component: SurveyComponent},
          { path: 'topic', component: TopicComponent}
        ],
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule {}
