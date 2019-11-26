import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { ResponsedomainCodeListComponent } from './responsedomain/codelist.component';
import { ResponsedomainDatetimeComponent } from './responsedomain/datetime.component';
import { ResponsedomainMissingComponent } from './responsedomain/missing.component';
import { ResponsedomainMixedComponent } from './responsedomain/mixed.component';
import { ResponsedomainNumericComponent } from './responsedomain/numeric.component';
import { ResponsedomainScaleComponent } from './responsedomain/scale.component';
import { ResponsedomainTextComponent } from './responsedomain/text.component';
import { PreviewConceptComponent } from './concept/preview.concept.component';
import { PreviewConceptListComponent } from './concept/preview.conceptlist.component';
import { PreviewTopicComponent } from './topicgroup/preview.topic.component';
import { PreviewTopicListComponent } from './topicgroup/preview.topiclist.component';
import { PreviewStudyComponent } from './study/preview.study.component';
import { PreviewStudyListComponent } from './study/preview.studylist.component';
import { PreviewQuestionitemComponent } from './questionitem/preview.questionitem.component';
import { PreviewQuestionitemGridComponent } from './questionitem/preview.questionitem-grid.component';
import { PreviewResponsedomainComponent } from './responsedomain/preview.responsedomain.component';
import { PreviewResponseDomainGridComponent } from './responsedomain/preview.responsedomain-grid.component';
import { PreviewConditionConstructComponent } from './controlconstruct/preview.condition.component';
import { PreviewSequenceConstructComponent } from './controlconstruct/preview.sequence.component';
import { PreviewStatementConstructComponent } from './controlconstruct/preview.statement.component';
import { PreviewQuestionConstructComponent } from './controlconstruct/preview.question.component';
import { PreviewControlConstructComponent } from './controlconstruct/preview.controlconstruct.component';
import { PreviewSurveyComponent } from './surveyprogram/preview.survey.component';
import { PreviewInstrumentComponent } from './instrument/preview.instrument.component';
import { PreviewComponent } from './preview.component';
import { PreviewDialogComponent } from './preview-dialog.component';
import { PreviewService } from '../../lib/services';
import { PreviewPublicationComponent } from './publication/preview.publication.component';

@NgModule({
  imports: [ ComponentsModule ],

  declarations: [PreviewConceptComponent, PreviewConceptListComponent, PreviewConditionConstructComponent,
    PreviewControlConstructComponent, PreviewQuestionConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent, PreviewResponseDomainGridComponent,
    PreviewResponsedomainComponent, PreviewSequenceConstructComponent, PreviewStatementConstructComponent,
    PreviewStudyComponent, PreviewTopicComponent, PreviewTopicListComponent, PreviewStudyListComponent,
    PreviewSurveyComponent, PreviewInstrumentComponent, PreviewPublicationComponent,
    ResponsedomainCodeListComponent, ResponsedomainDatetimeComponent, ResponsedomainMissingComponent,
    ResponsedomainMixedComponent, ResponsedomainNumericComponent, ResponsedomainScaleComponent,
    ResponsedomainTextComponent, PreviewComponent, PreviewDialogComponent ],

  exports: [PreviewConceptComponent, PreviewConceptListComponent, PreviewTopicComponent,
    PreviewTopicListComponent, PreviewStudyComponent, PreviewControlConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent, ResponsedomainDatetimeComponent,
    PreviewResponsedomainComponent , PreviewInstrumentComponent, PreviewPublicationComponent,
    PreviewComponent, PreviewDialogComponent ],

  providers: [ PreviewService ]

})

export class PreviewModule { }
