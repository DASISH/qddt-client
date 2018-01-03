import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';
import { HttpModule } from '@angular/http';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule }   from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { InstrumentModule } from './instrument/instrument.module';
import { PublicationModule } from './publication/publication.module';
import { ResponsedomainModule } from './responsedomain/responsedomain.module';
import { ControlConstructModule } from './controlconstruct/controlconstruct.module';
import { SequenceModule } from './sequence/sequence.module';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { AuthGuard } from './auth/auth-guard.service';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';

@NgModule({
  imports: [ routing, BrowserModule, HttpModule,  SharedModule, HomeModule,
    CategoryModule, ResponsedomainModule, QuestionModule, ControlConstructModule,
    SequenceModule, InstrumentModule, PublicationModule],
  declarations: [ AppComponent, PageNotFoundComponent ,AlertComponent],
  providers: [AuthGuard, AlertService, {
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }, {
    provide: API_BASE_HREF,
    useValue: '<%= API_BASE %>'
  }],
  bootstrap: [ AppComponent ]

})

export class AppModule { }
