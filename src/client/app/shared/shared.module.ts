import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { LocalDatePipe } from '../common/date_pipe';
import { AuthorChipComponent } from '../components/author/author.chip.component';
import { QddtTableComponent } from '../components/table/table.component';
import { QddtPagination } from '../components/pagination/pagination';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';
import { RationalComponent } from '../components/rational/rational.component';
import { StudyUsedbyComponent } from '../components/study/study.usedby.component';
import { TopicUsedbyComponent } from '../components/topic/topic.usedby.component';
import { QuestionUsedbyComponent } from '../components/question/question.usedby.component';
import { ResponsedomainUsedbyComponent } from '../components/responsedomain/responsedomain.usedby.component';

@NgModule({
  imports: [CommonModule, FormsModule, MaterializeModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPagination, AutocompleteComponent,
    StudyUsedbyComponent, TopicUsedbyComponent, QuestionUsedbyComponent,
    ResponsedomainUsedbyComponent,
    AuthorChipComponent, RationalComponent ],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
    StudyUsedbyComponent, TopicUsedbyComponent, QuestionUsedbyComponent,
    ResponsedomainUsedbyComponent,
    QddtTableComponent, QddtPagination, AutocompleteComponent, RationalComponent,
    AuthorChipComponent]
})

export class SharedModule { }
