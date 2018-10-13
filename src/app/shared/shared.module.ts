import { MaterializeModule } from 'angular2-materialize';
import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ParentFormConnectDirective } from './directive/parent-form-connect.directive';
import { AutosizeDirective } from './directive/autosize.directive';
import { GravatarDirective } from './directive/gravatar.directive';
import { EqualValidator } from './directive/validate-password.directive';

import { LocalDatePipe } from './date.pipe';
import { AuthorChipComponent } from './author/author.chip.component';
import { QddtTableComponent } from './table/table.component';
import { QddtPaginationComponent } from './pagination/pagination.component';
import { QddtAutoCompleteComponent } from './autocomplete/autocomplete.component';
import { ElementFooterComponent } from './footer/elementfooter.component';
import { RationalComponent } from './rational/rational.component';
import { RevisionComponent } from './revision/revision.component';
import { CompareModule } from './compare/compare.module';
import { VersionComponent } from './version/version.component';
import { VersionLabelComponent } from './version/version.label.component';
import { TocComponent } from './toc/toc.component';
import { CommentListComponent } from './comment/comment.list.component';
import { CommentCreateComponent } from './comment/comment.create.component';
import { ConceptrefComponent } from './conceptref/conceptref.component';
import { FormErrorsComponent } from './form-errors/form-errors.component';
import { ConfirmDeleteComponent } from './confim-delete/delete.component';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  imports: [ MaterializeModule, CommonModule, RouterModule, FormsModule, CompareModule ],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, CommentCreateComponent,
    RationalComponent, RevisionComponent,  ConceptrefComponent, FormErrorsComponent, SpinnerComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective, EqualValidator ],
  exports: [ LocalDatePipe, CommonModule, FormsModule, MaterializeModule, SpinnerComponent,
     QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent,
    RationalComponent, RevisionComponent, ConceptrefComponent, FormErrorsComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective, EqualValidator ],
  providers: []
})

export class SharedModule { }
