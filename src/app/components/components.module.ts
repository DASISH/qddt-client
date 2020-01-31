import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


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
import { FileDownloadComponent } from './download/download.component';
import { TemplateComponent, TemplateDetailComponent, TemplateListComponent, TemplateService } from './template';
import { LocalDatePipe, LocalNumberPipe } from '../lib';
import { AutosizeDirective, EqualValidator, GravatarDirective, ParentFormConnectDirective, ContenteditableDirective } from '../lib/directives';
import { DialogComponent } from './dialog/dialog.component';
import { DialogBigComponent } from './dialog/dialog-big.component';
import { ValidationComponent } from './form/validation.component';
import { FormSelectComponent } from './form/select.component';
import { FormInputComponent } from './form/input.component';
import { FormTextAreaComponent } from './form/textarea.component';
import { FormInputNComponent } from './form/input-number.component';
// import { TreeViewComponent } from './tree-view/tree-view.component';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, CompareModule],
  declarations: [LocalDatePipe, LocalNumberPipe, TemplateComponent, TemplateListComponent, TemplateDetailComponent,
    QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent, FileDownloadComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent, DialogBigComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, CommentCreateComponent, DialogComponent,
    RationalComponent, RevisionComponent, ConceptrefComponent, FormErrorsComponent, SpinnerComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective, ContenteditableDirective, EqualValidator,
    FormSelectComponent, FormInputComponent, FormTextAreaComponent, FormInputNComponent, ValidationComponent],
  exports: [LocalDatePipe, LocalNumberPipe, CommonModule, FormsModule, SpinnerComponent,
    QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent, FileDownloadComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, DialogComponent, DialogBigComponent,
    RationalComponent, RevisionComponent, ConceptrefComponent, FormErrorsComponent,
    TemplateComponent, TemplateListComponent, TemplateDetailComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective, EqualValidator, ContenteditableDirective,
    FormSelectComponent, FormInputComponent, FormTextAreaComponent, FormInputNComponent],
  providers: [TemplateService]
})

export class ComponentsModule { }
