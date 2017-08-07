import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { LocalDatePipe } from './date.pipe';
import { AuthorChipComponent } from './author/author.chip.component';
import { QddtTableComponent } from './table/table.component';
import { QddtPaginationComponent } from './pagination/pagination';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ElementFooterComponent } from './form/footer/elementfooter.component';
import { RationalComponent } from './rational/rational.component';
import { CommentListComponent } from './comment/comment.list.component';
import { CommentCreateComponent } from './comment/comment.create.component';
import { RevisionComponent } from './revision/revision.component';
import { CompareModule } from './compare/compare.module';
import { DialogBoxComponent } from './dialogbox/dialogbox.component';
import { VersionComponent } from './form/version/version.component';
import { VersionLabelComponent } from './form/version/version.label.component';
// import { PreviewPublicationComponent } from './preview/preview.component';
// import { PreviewStudyComponent } from './preview/preview.study.component';
// import { PreviewTopicComponent } from './preview/preview.topic.component';
// import { PreviewConceptComponent } from './preview/preview.concept.component';
// import { PreviewResponsedomainComponent } from './preview/preview.responsedomain.component';
// import { PreviewQuestionitemComponent } from './preview/preview.questionitem.component';
// import { PreviewControlConstructComponent } from './preview/preview.controlconstruct.component';
// import { PreviewTopicListComponent } from './preview/preview.topiclist.component';
// import { PreviewConceptListComponent } from './preview/preview.conceptlist.component';
// import { PreviewQuestionComponent } from './preview/preview.question.component';
// import { PreviewResponseDomainOneLineComponent } from './preview/preview.responsedomain.oneline.component';
// import { ResponsedomainTextComponent } from './preview/responsedomain/text.component';
// import { ResponsedomainScaleComponent } from './preview/responsedomain/scale.component';
// import { ResponsedomainNumericComponent } from './preview/responsedomain/numeric.component';
// import { ResponsedomainMixedComponent } from './preview/responsedomain/mixed.component';
// import { ResponsedomainDatetimeComponent } from './preview/responsedomain/datetime.component';
// import { ResponsedomainMissingComponent } from './preview/responsedomain/missing.component';
// import { ResponsedomainCodeListComponent } from './preview/responsedomain/codelist.component';
// import { PreviewModule } from '../common/preview/preview.module';


@NgModule({
  imports: [CommonModule, FormsModule, MaterializeModule,CompareModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent,VersionLabelComponent
    ,RationalComponent,CommentListComponent,CommentCreateComponent, RevisionComponent,DialogBoxComponent],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
     QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent,ElementFooterComponent,VersionComponent, VersionLabelComponent,
    RationalComponent,CommentListComponent,RevisionComponent,DialogBoxComponent]
})

export class SharedModule { }
