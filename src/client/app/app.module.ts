import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';
import { HttpModule } from '@angular/http';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule }   from './components/home/home.module';
import { UserService } from './shared/user/user.service';
import { SharedModule } from './shared/shared.module';
import { CategoryModule } from './components/category/category.module';
import { QuestionModule } from './components/question/question.module';
import { ResponsedomainModule } from './components/responsedomain/responsedomain.module';
import { ControlConstructModule } from './components/controlconstruct/controlconstruct.module';
import { InstrumentModule } from './components/instrument/instrument.module';
import { SequenceModule } from './components/sequence/sequence.module';
import { PublicationModule } from './components/publication/publication.module';
import { AuthGuard } from './auth-guard.service';
// import { PageNotFoundComponent } from './components/pagenotfound/page-not-found.component';

@NgModule({
  imports: [ routing, BrowserModule, HttpModule,  SharedModule,  HomeModule,
    CategoryModule, ResponsedomainModule, QuestionModule, ControlConstructModule,
    SequenceModule, InstrumentModule, PublicationModule],
  declarations: [ AppComponent ],
  providers: [AuthGuard, UserService, {
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }, {
    provide: API_BASE_HREF,
    useValue: '<%= API_BASE %>'
  }],
  bootstrap: [ AppComponent ]

})

export class AppModule { }
