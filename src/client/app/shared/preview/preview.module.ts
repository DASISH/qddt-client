import { NgModule } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ResponsedomainCodeListComponent } from './responsedomain/codelist.component';
import { ResponsedomainDatetimeComponent } from './responsedomain/datetime.component';
import { ResponsedomainMissingComponent } from './responsedomain/missing.component';
import { ResponsedomainMixedComponent } from './responsedomain/mixed.component';
import { ResponsedomainNumericComponent } from './responsedomain/numeric.component';
import { ResponsedomainScaleComponent } from './responsedomain/scale.component';
import { ResponsedomainTextComponent } from './responsedomain/text.component';
import { PreviewConceptComponent } from './preview.concept.component';
import { PreviewTopicComponent } from './preview.topic.component';
import { PreviewConceptListComponent } from './preview.conceptlist.component';
import { PreviewTopicListComponent } from './preview.topiclist.component';
import { PreviewStudyComponent } from './preview.study.component';
import { PreviewQuestionitemComponent } from './preview.questionitem.component';
import { PreviewResponsedomainComponent } from './preview.responsedomain.component';
import { PreviewQuestionitemGridComponent } from './preview.questionitem-grid.component';
import { PreviewResponseDomainGridComponent } from './preview.responsedomain-grid.component';
import { PreviewConditionConstructComponent } from './controlconstruct/preview.condition.component';
import { PreviewSequenceConstructComponent } from './controlconstruct/preview.sequence.component';
import { PreviewStatementConstructComponent } from './controlconstruct/preview.statement.component';
import { PreviewQuestionConstructComponent } from './controlconstruct/preview.question.component';
import { PreviewControlConstructComponent } from './preview.controlconstruct.component';
import { PreviewPublicationComponent } from './preview.publication.component';

@NgModule({
  imports: [ SharedModule],

  declarations: [PreviewConceptComponent, PreviewConceptListComponent, PreviewConditionConstructComponent,
    PreviewControlConstructComponent, PreviewQuestionConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent, PreviewResponseDomainGridComponent,
    PreviewResponsedomainComponent, PreviewSequenceConstructComponent, PreviewStatementConstructComponent,
    PreviewStudyComponent, PreviewTopicComponent, PreviewTopicListComponent,
    ResponsedomainCodeListComponent, ResponsedomainDatetimeComponent, ResponsedomainMissingComponent,
    ResponsedomainMixedComponent, ResponsedomainNumericComponent, ResponsedomainScaleComponent,
    ResponsedomainTextComponent, PreviewPublicationComponent],

  exports: [PreviewConceptComponent, PreviewConceptListComponent, PreviewTopicComponent,
    PreviewTopicListComponent, PreviewStudyComponent, PreviewControlConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent,
    PreviewResponsedomainComponent , PreviewPublicationComponent]

})

export class PreviewModule { }
