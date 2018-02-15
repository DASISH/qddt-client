import { MaterializeModule } from 'angular2-materialize';
import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParentFormConnectDirective } from './directive/parent-form-connect.directive';
import { AutosizeDirective } from './directive/autosize.directive';
import { LocalDatePipe } from './date.pipe';
import { AuthorChipComponent } from './author/author.chip.component';
import { QddtTableComponent } from './table/table.component';
import { QddtPaginationComponent } from './pagination/pagination';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ElementFooterComponent } from './footer/elementfooter.component';
import { RationalComponent } from './rational/rational.component';
import { RevisionComponent } from './revision/revision.component';
import { CompareModule } from './compare/compare.module';
import { DialogBoxComponent } from './dialogbox/dialogbox.component';
import { VersionComponent } from './version/version.component';
import { VersionLabelComponent } from './version/version.label.component';
import { ConfirmDeleteComponent } from './confim-delete/delete.component';
import { TocComponent } from './toc/toc.component';
import { RouterModule } from '@angular/router';
import { CommentListComponent } from './comment/comment.list.component';
import { CommentCreateComponent } from './comment/comment.create.component';
import { GravatarDirective } from './directive/gravatar.directive';


@NgModule({
  imports: [MaterializeModule, CommonModule, RouterModule, FormsModule, CompareModule ],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent, CommentCreateComponent,
    RationalComponent, RevisionComponent, DialogBoxComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective ],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
     QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent, TocComponent, CommentListComponent,
    RationalComponent, RevisionComponent, DialogBoxComponent,
    AutosizeDirective, ParentFormConnectDirective, GravatarDirective ]
})

export class SharedModule { }
