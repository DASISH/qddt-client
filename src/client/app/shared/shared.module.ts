import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { LocalDatePipe } from '../common/date_pipe';
import { AuthorChipComponent } from '../components/author/author_chip.component';
import { AuthorChipEditComponent } from '../components/author/author_chip.edit.component';
import { AuthorListModalComponent } from '../components/author/author_list_modal.component';
import { QddtTableComponent } from '../components/table/table.component';
import { QddtPagination } from '../components/pagination/pagination';
import { AutocompleteComponent } from '../components/autocomplete/autocomplete.component';

@NgModule({
  imports: [CommonModule, FormsModule, MaterializeModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPagination, AutocompleteComponent,
  AuthorChipComponent, AuthorChipEditComponent, AuthorListModalComponent ],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
      QddtTableComponent, QddtPagination, AutocompleteComponent,
  AuthorChipComponent, AuthorChipEditComponent, AuthorListModalComponent]
})

export class SharedModule { }
