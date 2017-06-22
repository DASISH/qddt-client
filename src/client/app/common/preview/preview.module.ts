import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommentModule } from '../comment/comment.module';
import { RevisionModule } from '../revision/revision.module';
import { PreviewConceptComponent } from './preview.concept.component';
import { PreviewControlConstructComponent } from './preview.controlconstruct.component';
import { PreviewTopicComponent } from './preview.topic.component';
import { PreviewQuestionitemComponent } from './preview.questionitem.component';
import { PreviewConceptListComponent } from './preview.conceptlist.component';
import { PreviewTopicListComponent } from './preview.topiclist.component';
import { PreviewStudyComponent } from './preview.study.component';
import { ResponsedomainModule } from '../../components/responsedomain/responsedomain.module';
import { PreviewQuestionComponent } from './preview.question.component';
import { PreviewResponseDomainOneLineComponent } from './preview.responsedomain.oneline.component';

@NgModule({
  imports: [SharedModule, CommentModule,RevisionModule,ResponsedomainModule],

  declarations: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionComponent,PreviewResponseDomainOneLineComponent],

  exports: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,PreviewQuestionitemComponent]
})

export class PreviewModule { }
