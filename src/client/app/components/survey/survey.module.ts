import { NgModule } from '@angular/core';
import { SurveyComponent }   from './survey.component';
import { SurveyEditComponent }   from './edit/survey.edit.component';
import { RevisionModule } from '../../common/revision/revision.module';
import { CompareModule } from '../../common/compare/compare.module';
import { CommentModule } from '../../common/comment/comment.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
    declarations: [SurveyComponent, SurveyEditComponent],
    exports: [SurveyComponent, SurveyEditComponent]
})

export class SurveyModule { }
