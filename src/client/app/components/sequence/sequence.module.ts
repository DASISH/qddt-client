import { NgModule } from '@angular/core';
import { RevisionModule } from '../revision/revision.module';
import { CompareModule } from '../compare/compare.module';
import { CommentModule } from '../comment/comment.module';
import { SharedModule } from '../../shared/shared.module';
import { SequenceComponent } from './sequence.component';
import { SequenceDetailComponent } from './sequence.detail.component';
import { SequenceReuseComponent } from './sequence.reuse.component';
import { SequenceContentComponent } from './sequence.content.component';
import { ConditionPreviewComponent } from './preview/condition.preview.component';
import { ConstructPreviewComponent } from './preview/construct.preview.component';
import { ControlConstructPreviewComponent } from './preview/controlconstruct.preview.component';
import { SequencePreviewComponent } from './preview/sequence.preview.component';
import { StatementPreviewComponent } from './preview/statement.preview.component';
import { ConditionEditComponent } from './condition.edit.component';
import { StatementEditComponent } from './statement.edit.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';

@NgModule({
  imports: [ SharedModule, RevisionModule, CompareModule, CommentModule, ResponsedomainModule ],
  declarations: [ SequenceComponent, SequenceDetailComponent, SequenceReuseComponent,
    SequenceContentComponent, ConditionPreviewComponent, ConstructPreviewComponent,
    ControlConstructPreviewComponent, SequencePreviewComponent, StatementPreviewComponent,
    ConditionEditComponent, StatementEditComponent ],
  exports: [ SequenceComponent ]
})

export class SequenceModule { }
