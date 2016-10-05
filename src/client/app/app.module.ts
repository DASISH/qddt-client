import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { HttpModule } from '@angular/http';
import { AppCmp } from './components/app/app.component';

import { routing } from './app.routes';
import { HomeModule }   from './components/home/home.module';
import { LoginModule } from './components/login/login.module';
import { UserService } from './common/user.service';
import { RevisionModule } from './components/revision/revision.module';
import { CommentModule } from './components/comment/comment.module';

import { CompareModule } from './components/compare/compare.module';
import { SharedModule } from './shared/shared.module';
import { CategoryModule } from './components/category/category.module';
import { QuestionModule } from './components/question/question.module';
import { ResponsedomainModule } from './components/responsedomain/responsedomain.module';
import { ControlConstructModule } from './components/controlconstruct/controlconstruct.module';

@NgModule({
  imports: [ BrowserModule, HttpModule, CategoryModule,
    QuestionModule, ResponsedomainModule, ControlConstructModule,
    routing, HomeModule, LoginModule, RevisionModule,
    CompareModule, CommentModule, SharedModule],
  declarations: [ AppCmp ],
  providers: [UserService, {
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }, {
    provide: API_BASE_HREF,
    useValue: '<%= API_BASE %>'
  }],
  bootstrap: [ AppCmp ]

})

export class AppModule { }
