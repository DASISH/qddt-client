import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
// import { CommentModule } from '../../shared/comment/comment.module';
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
import { PreviewComponent } from './preview.component';

@NgModule({
  imports: [ ResponsedomainModule,SharedModule],

  declarations: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionComponent,PreviewResponseDomainOneLineComponent,
    PreviewComponent],

  exports: [PreviewConceptComponent,PreviewConceptListComponent,PreviewTopicComponent,
    PreviewTopicListComponent,PreviewStudyComponent,PreviewControlConstructComponent,PreviewQuestionitemComponent,
    PreviewComponent]
})

export class PreviewModule { }
