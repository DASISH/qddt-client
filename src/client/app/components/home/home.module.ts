import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { SurveyModule } from '../survey/survey.module';
import { StudyModule } from '../study/study.module';
import { TopicModule } from '../topic/topic.module';
import { ConceptModule } from '../concept/concept.module';

@NgModule({
    imports: [ SharedModule, SurveyModule, StudyModule, TopicModule, ConceptModule ],
    declarations: [HomeComponent],
    exports: [HomeComponent]
})

export class HomeModule { }
