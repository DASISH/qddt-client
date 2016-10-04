import { NgModule } from '@angular/core';
import { HomeCmp } from './home.component';

import { CommitListComponent } from '../github/commit_list.component';
import { SharedModule } from '../../shared/shared.module';
import { SurveyModule } from '../surveyprogram/survey.module';
import { StudyModule } from '../study/study.module';
import { TopicModule } from '../topic/topic.module';

@NgModule({
    imports: [ SharedModule, SurveyModule, StudyModule, TopicModule ],
    declarations: [HomeCmp, CommitListComponent],
    exports: [HomeCmp]
})

export class HomeModule { }
