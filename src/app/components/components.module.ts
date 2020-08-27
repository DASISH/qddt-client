import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { LocalDatePipe, LocalNumberPipe, FilterPipe } from '../lib';
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
import { SpinnerComponent } from './spinner/spinner.component';
import { FileDownloadComponent } from './download/download.component';
import { TemplateComponent, TemplateDetailComponent, TemplateListComponent, TemplateService } from './template';
import { EqualValidator, GravatarDirective, ParentFormConnectDirective, ContenteditableDirective } from '../lib/directives';
import { ConfirmDeleteComponent } from './dialog/delete.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogBigComponent } from './dialog/dialog-big.component';
import { ValidationComponent } from './form/validation.component';
import { FormSelectComponent } from './form/select.component';
import { FormInputComponent } from './form/input.component';
import { FormTextAreaComponent } from './form/textarea.component';
import { FormInputNComponent } from './form/input-number.component';
import { ParameterComponent } from './parameter/parameter.component';
import { MustMatchDirective } from './form/match.directive';
import { ConfirmRemoveComponent } from './dialog/remove.component';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, CompareModule, DragDropModule],
  declarations: [LocalDatePipe, LocalNumberPipe, FilterPipe, TemplateComponent, TemplateListComponent, TemplateDetailComponent,
    QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent, FileDownloadComponent, ParameterComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent, DialogBigComponent, ConfirmRemoveComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, CommentCreateComponent, DialogComponent,
    RationalComponent, RevisionComponent, ConceptrefComponent, MustMatchDirective, SpinnerComponent,
    ParentFormConnectDirective, GravatarDirective, ContenteditableDirective, EqualValidator,
    FormSelectComponent, FormInputComponent, FormTextAreaComponent, FormInputNComponent, ValidationComponent],
  exports: [LocalDatePipe, LocalNumberPipe, FilterPipe, CommonModule, FormsModule, SpinnerComponent,
    QddtTableComponent, QddtPaginationComponent, QddtAutoCompleteComponent, FileDownloadComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, DialogComponent, DialogBigComponent, ConfirmRemoveComponent,
    RationalComponent, RevisionComponent, ConceptrefComponent, MustMatchDirective,
    TemplateComponent, TemplateListComponent, TemplateDetailComponent, ParameterComponent,
    ParentFormConnectDirective, GravatarDirective, EqualValidator, ContenteditableDirective,
    FormSelectComponent, FormInputComponent, FormTextAreaComponent, FormInputNComponent],
  providers: [TemplateService]
})

export class ComponentsModule { }
