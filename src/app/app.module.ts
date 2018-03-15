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
import { CoreModule } from './core/core.module';
import { TokenInterceptor } from './core/interceptor/token.interceptor';
import { MenuModule } from './menu/menu.module';
import { ErrorLogService } from './errorhandler/error-log.service';
import { GlobalErrorHandler } from './errorhandler/error.service';
import { environment } from '../environments/environment';
import { PreviewModule } from './preview/preview.module';

@NgModule({
  declarations: [ AppComponent, PageNotFoundComponent ],
  imports: [ BrowserModule, HttpClientModule,  SharedModule, CoreModule, HomeModule, MenuModule,
    CategoryModule, ResponsedomainModule, QuestionModule, ControlConstructModule, PreviewModule,
    SequenceModule, InstrumentModule, PublicationModule, routing ],
  providers: [ ErrorLogService,
    { provide: APP_BASE_HREF, useValue: environment.APP_BASE },
    { provide: API_BASE_HREF, useValue: environment.API_BASE },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
