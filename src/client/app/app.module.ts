import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { InstrumentModule } from './instrument/instrument.module';
import { PublicationModule } from './publication/publication.module';
import { ResponsedomainModule } from './responsedomain/responsedomain.module';
import { ControlConstructModule } from './controlconstruct/controlconstruct.module';
import { SequenceModule } from './sequence/sequence.module';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';
import { AuthModule } from './auth/auth.module';
import { TokenInterceptor } from './auth/auth.interceptor';
import { GravatarModule } from 'ng2-gravatar-directive/src/gravatar.module';
import { GlobalErrorHandler } from './errorhandler/error.service';
import { ErrorLogService } from './errorhandler/error-log.service';

@NgModule({
  imports: [ routing, BrowserModule, HttpClientModule,  SharedModule, HomeModule, AuthModule,
    CategoryModule, ResponsedomainModule, QuestionModule, ControlConstructModule,
    SequenceModule, InstrumentModule, PublicationModule,GravatarModule],
  declarations: [ AppComponent, PageNotFoundComponent , AlertComponent],
  providers: [ AlertService, ErrorLogService,
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' },
    { provide: API_BASE_HREF, useValue: '<%= API_BASE %>' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [ AppComponent ]

})

export class AppModule { }
