import { NgModule } from '@angular/core';
import { QuestionComp } from './question.component';
import { QuestionDetail } from './question_detail.component';
import { QuestionReuseComponent } from './question.reuse';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule, RevisionModule, CompareModule, CommentModule ],
  declarations: [QuestionComp, QuestionDetail, QuestionReuseComponent],
  exports: [QuestionComp, QuestionReuseComponent]
})

export class QuestionModule { }
