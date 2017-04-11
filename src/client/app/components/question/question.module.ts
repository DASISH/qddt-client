import { NgModule } from '@angular/core';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { QuestionItemEditComponent } from './question.edit.component';
import { TreeNodeComponent } from './question.tree.node.component';

import { QuestionReuseComponent } from './question.reuse.component';
import { QuestionItemEditMissingComponent } from './question.edit.missing.component';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';

@NgModule({
  imports: [ SharedModule, ResponsedomainModule, RevisionModule, CompareModule, CommentModule ],
  declarations: [QuestionComponent, QuestionDetailComponent,
    QuestionReuseComponent, QuestionItemEditComponent,
    TreeNodeComponent, QuestionItemEditMissingComponent],
  exports: [QuestionComponent, QuestionReuseComponent, QuestionItemEditComponent, QuestionDetailComponent ]
})

export class QuestionModule { }
