import { MaterializeModule } from 'angular2-materialize';
import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { UserLoginComponent } from './user/user.component';
import { LoginComponent } from '../auth/login/login.component';
import { AutosizeDirective } from './autoresize/autosize.directive';
import { ParentFormConnectDirective } from './directive/parent-form-connect.directive';


@NgModule({
  imports: [MaterializeModule,CommonModule, RouterModule, FormsModule, CompareModule],
  declarations: [ LocalDatePipe, QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent, ElementFooterComponent, VersionComponent,VersionLabelComponent,AutosizeDirective,
    ConfirmDeleteComponent,TocComponent,CommentListComponent,CommentCreateComponent,
    RationalComponent, RevisionComponent,DialogBoxComponent, LoginComponent,UserLoginComponent,
    ParentFormConnectDirective],
  exports: [LocalDatePipe, CommonModule, FormsModule, MaterializeModule,AutosizeDirective,
     QddtTableComponent, QddtPaginationComponent, AutocompleteComponent,
    AuthorChipComponent,ElementFooterComponent,VersionComponent, VersionLabelComponent,
    ConfirmDeleteComponent,TocComponent,CommentListComponent,
    RationalComponent,RevisionComponent,DialogBoxComponent, UserLoginComponent,
    ParentFormConnectDirective]
})

export class SharedModule { }
