import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { LocalDatePipe } from '../common/date.pipe';
import { AuthorChipComponent } from '../common/author/author.chip.component';
import { QddtTableComponent } from '../common/table/table.component';
import { QddtPaginationComponent } from '../common/pagination/pagination';
import { AutocompleteComponent } from '../common/autocomplete/autocomplete.component';
import { RationalComponent } from '../common/rational/rational.component';
import { ElementFooterComponent } from '../common/elementfooter/elementfooter.component';


@NgModule({
  imports: [CommonModule, FormsModule, MaterializeModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, RationalComponent ,ElementFooterComponent],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
     QddtTableComponent, QddtPaginationComponent, ElementFooterComponent,
    AutocompleteComponent, RationalComponent,AuthorChipComponent]
})

export class SharedModule { }
