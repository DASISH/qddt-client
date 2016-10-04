import { NgModule } from '@angular/core';
import { SurveyProgramComponent }   from '../surveyprogram/surveyprogram.component';
import { SurveyProgramEditComponent }   from './edit/surveyprogram_edit.component';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [ SharedModule, RevisionModule, CompareModule, CommentModule ],
    declarations: [SurveyProgramComponent, SurveyProgramEditComponent],
    exports: [SurveyProgramComponent, SurveyProgramEditComponent]
})

export class SurveyModule { }
