import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home.routes';
import { HomeComponent } from './home.component';
import { SurveyModule } from './survey/survey.module';
import { StudyModule } from './study/study.module';
import { TopicModule } from './topic/topic.module';
import { ConceptModule } from './concept/concept.module';

@NgModule({
  imports: [ SharedModule, HomeRoutingModule, SurveyModule, StudyModule, TopicModule, ConceptModule ],
  declarations: [HomeComponent],
  providers: [],
  exports: [HomeComponent]
})

export class HomeModule { }
