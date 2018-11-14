import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { PreviewModule } from './preview/preview.module';
import { ComponentsModule } from './components/components.module';
import { HomeModule } from './modules/home/home.module';
import { CoreModule } from './modules/core/core.module';
import { MenuModule } from './modules/menu/menu.module';
import { QuestionModule } from './modules/question/question.module';
import { MissingModule } from './modules/category-missing/missing.module';
import { ResponsedomainModule } from './modules/responsedomain/responsedomain.module';
import { QuestionConstructModule } from './modules/construct-question/question-construct.module';
import { SequenceModule } from './modules/construct-sequence/sequence-construct.module';
import { InstrumentModule } from './modules/instrument/instrument.module';
import { PublicationModule } from './modules/publication/publication.module';
import { SelectorDialogsModule } from './selectors-dialog/selectors-dialog.module';
import { UserModule } from './modules/user/user.module';

import { UniverseModule } from './modules/universe/universe.module';
import { InstructionModule } from './modules/instruction/instruction.module';
import { CategoryModule } from './modules/category/category.module';
import { DialogModule } from './modules/dialog/dialog.module';


import { ChangeLogModule } from './modules/changelog/changelog.module';
import { TemplateService } from './components/template';
import {PageNotFoundComponent} from './modules/core/pagenotfound/page-not-found.component';
import {ErrorLogService, GlobalErrorHandler, TokenInterceptor} from './modules/core/services';
import {ControlConstructModule} from './modules/controlconstruct/controlconstruct.module';


@NgModule({
  imports: [ BrowserModule, HttpClientModule, ComponentsModule, CoreModule, HomeModule, MenuModule, SelectorDialogsModule, DialogModule,
    CategoryModule,  ResponsedomainModule, QuestionModule, ControlConstructModule, PreviewModule, MissingModule, UniverseModule,
    ChangeLogModule, InstructionModule, InstrumentModule,
    PublicationModule, QuestionConstructModule, SequenceModule, UserModule, routing ],

    declarations: [ AppComponent, PageNotFoundComponent ],

    providers: [ ErrorLogService, TemplateService,
    { provide: APP_BASE_HREF, useValue: environment.APP_BASE },
    { provide: API_BASE_HREF, useValue: environment.API_BASE },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
