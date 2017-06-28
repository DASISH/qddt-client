import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterializeModule } from 'angular2-materialize';
import { LocalDatePipe } from './date.pipe';
import { AuthorChipComponent } from './author/author.chip.component';
import { QddtTableComponent } from './table/table.component';
import { QddtPaginationComponent } from './pagination/pagination';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ElementFooterComponent } from './elementfooter/elementfooter.component';
import { RationalComponent } from './rational/rational.component';
import { CommentListComponent } from './comment/comment.list.component';
import { CommentCreateComponent } from './comment/comment.create.component';
import { RevisionComponent } from './revision/revision.component';
import { CompareModule } from './compare/compare.module';
import { DialogBoxComponent } from './dialogbox/dialogbox.component';


@NgModule({
  imports: [CommonModule, FormsModule, MaterializeModule,CompareModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent,RationalComponent,CommentListComponent,CommentCreateComponent,
    RevisionComponent,DialogBoxComponent],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
     QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent,ElementFooterComponent,RationalComponent,CommentListComponent,
    RevisionComponent,DialogBoxComponent]
})

export class SharedModule { }
