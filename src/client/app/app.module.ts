import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

//import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
//import { AppComponent } from './app.component';
import { AppCmp } from './components/app/app.component';

import { routing } from './app.routes';
import { HomeCmp }   from './components/home/home.component';
//import { QuestionComp } from './components/question/question.component';
//import { ConceptComponent } from './components/concept/concept.component';
import { CategoryComponent } from './components/category/category.component';
import { CategoryService } from './components/category/category.service';
import { CategoryDetailComponent } from './components/category/category.detail.component';
import { CategoryEditComponent } from './components/category/edit/category_edit.component';

import { CategorySchemeComponent } from './components/category/category.scheme.component';
//import { ResponsedomainComponent } from './components/responsedomain/responsedomain.component';
//import {DemoComponent} from './components/editor/demo.component';
//import {ControlConstructComponent} from './components/controlconstruct/controlconstruct.component';
import { LoginComponent } from './components/login/login.component';
import { UserService } from './common/user.service';
import { UserLogin } from './common/user.component';

import { CommitListComponent } from './components/github/commit_list.component';
import { QddtTableComponent } from './components/table/table.component';
import { RevisionComponent } from './components/revision/revision.component';
import { CommentListComponent } from './components/comment/comment_list.component';
import { QddtPagination } from './components/pagination/pagination';
import { DiffComponent } from './components/compare/diff.component';
import { NewCommentComponent } from './components/comment/new_comment.component';
import { LocalDatePipe } from './common/date_pipe';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';

@NgModule({
  imports: [ BrowserModule, HttpModule, FormsModule, routing ],
  declarations: [ AppCmp, HomeCmp, CategoryComponent, CategorySchemeComponent
    ,LoginComponent, CommitListComponent, QddtTableComponent
    ,CategoryDetailComponent, RevisionComponent, CommentListComponent
    ,QddtPagination, CategoryEditComponent, DiffComponent, NewCommentComponent
    ,LocalDatePipe, AutocompleteComponent, UserLogin],
  providers: [UserService, CategoryService, {
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }, {
    provide: API_BASE_HREF,
    useValue: '<%= API_BASE %>'
  }],
  bootstrap: [ AppCmp ]

})

export class AppModule { }
