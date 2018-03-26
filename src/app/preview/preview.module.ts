import { NgModule } from '@angular/core';
import { ResponsedomainCodeListComponent } from './responsedomain/codelist.component';
import { ResponsedomainDatetimeComponent } from './responsedomain/datetime.component';
import { ResponsedomainMissingComponent } from './responsedomain/missing.component';
import { ResponsedomainMixedComponent } from './responsedomain/mixed.component';
import { ResponsedomainNumericComponent } from './responsedomain/numeric.component';
import { ResponsedomainScaleComponent } from './responsedomain/scale.component';
import { ResponsedomainTextComponent } from './responsedomain/text.component';
import { PreviewConceptComponent } from './concept/preview.concept.component';
import { PreviewTopicComponent } from './topicgroup/preview.topic.component';
import { PreviewConceptListComponent } from './concept/preview.conceptlist.component';
import { PreviewTopicListComponent } from './topicgroup/preview.topiclist.component';
import { PreviewStudyComponent } from './study/preview.study.component';
import { PreviewQuestionitemComponent } from './questionitem/preview.questionitem.component';
import { PreviewResponsedomainComponent } from './responsedomain/preview.responsedomain.component';
import { PreviewQuestionitemGridComponent } from './questionitem/preview.questionitem-grid.component';
import { PreviewResponseDomainGridComponent } from './responsedomain/preview.responsedomain-grid.component';
import { PreviewConditionConstructComponent } from './controlconstruct/preview.condition.component';
import { PreviewSequenceConstructComponent } from './controlconstruct/preview.sequence.component';
import { PreviewStatementConstructComponent } from './controlconstruct/preview.statement.component';
import { PreviewQuestionConstructComponent } from './controlconstruct/preview.question.component';
import { PreviewControlConstructComponent } from './controlconstruct/preview.controlconstruct.component';
import { PreviewStudyListComponent } from './study/preview.studylist.component';
import { PreviewSurveyComponent } from './surveyprogram/preview.survey.component';
import { PreviewInstrumentComponent } from './instrument/preview.instrument.component';
import { PreviewComponent } from './preview.component';
import { SharedModule } from '../shared/shared.module';
import { PreviewDialogComponent } from './preview-dialog.component';
import { PreviewService } from './preview.service';
import { PreviewSelectComponent } from './preview.select.component';

@NgModule({
  imports: [ SharedModule],

  declarations: [PreviewConceptComponent, PreviewConceptListComponent, PreviewConditionConstructComponent,
    PreviewControlConstructComponent, PreviewQuestionConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent, PreviewResponseDomainGridComponent,
    PreviewResponsedomainComponent, PreviewSequenceConstructComponent, PreviewStatementConstructComponent,
    PreviewStudyComponent, PreviewTopicComponent, PreviewTopicListComponent, PreviewStudyListComponent,
    PreviewSurveyComponent, PreviewInstrumentComponent,
    ResponsedomainCodeListComponent, ResponsedomainDatetimeComponent, ResponsedomainMissingComponent,
    ResponsedomainMixedComponent, ResponsedomainNumericComponent, ResponsedomainScaleComponent,
    ResponsedomainTextComponent, PreviewComponent, PreviewDialogComponent, PreviewSelectComponent ],

  exports: [PreviewConceptComponent, PreviewConceptListComponent, PreviewTopicComponent,
    PreviewTopicListComponent, PreviewStudyComponent, PreviewControlConstructComponent,
    PreviewQuestionitemComponent, PreviewQuestionitemGridComponent,
    PreviewResponsedomainComponent , PreviewInstrumentComponent,
    PreviewComponent, PreviewDialogComponent, PreviewSelectComponent ],

  providers: [ PreviewService ]

})

export class PreviewModule { }
