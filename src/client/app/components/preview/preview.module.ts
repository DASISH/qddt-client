import { NgModule } from '@angular/core';
import { PreviewConceptComponent } from './preview.concept.component';
import { PreviewControlConstructComponent } from './preview.controlconstruct.component';
import { PreviewTopicComponent } from './preview.topic.component';
import { PreviewQuestionitemComponent } from './preview.questionitem.component';
import { SharedModule } from '../../shared/shared.module';
import { PreviewConceptListComponent } from './preview.conceptlist.component';
import { CommentModule } from '../comment/comment.module';
import { RevisionModule } from '../revision/revision.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { PreviewTopicListComponent } from './preview.topiclist.component';
import { PreviewStudyComponent } from './preview.study.component';

@NgModule({
  imports: [SharedModule, CommentModule,RevisionModule,ResponsedomainModule],

  declarations: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,PreviewQuestionitemComponent],

  exports: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,PreviewQuestionitemComponent]
})

export class PreviewModule { }
