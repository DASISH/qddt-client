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
import { ElementFooterComponent } from './form/footer/elementfooter.component';
import { RationalComponent } from './rational/rational.component';
import { RevisionComponent } from './revision/revision.component';
import { CompareModule } from './compare/compare.module';
import { DialogBoxComponent } from './dialogbox/dialogbox.component';
import { VersionComponent } from './form/version/version.component';
import { VersionLabelComponent } from './form/version/version.label.component';
import { ConfirmDeleteComponent } from './form/menu/delete.component';
import { TocComponent } from './form/toc/toc.component';
import { RouterModule } from '@angular/router';
import { CommentListComponent } from './comment/comment.list.component';
import { CommentCreateComponent } from './comment/comment.create.component';
import { GravatarModule } from 'ng2-gravatar-directive/src/gravatar.module';


@NgModule({
  imports: [MaterializeModule,CommonModule, RouterModule, FormsModule, CompareModule,GravatarModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent,VersionLabelComponent,
    ConfirmDeleteComponent,TocComponent,CommentListComponent,CommentCreateComponent,
    RationalComponent, RevisionComponent,DialogBoxComponent,
    AutosizeDirective, ParentFormConnectDirective],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,
     QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent,ElementFooterComponent,VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent,TocComponent,CommentListComponent,
    RationalComponent,RevisionComponent,DialogBoxComponent,
    AutosizeDirective, ParentFormConnectDirective]
})

export class SharedModule { }
