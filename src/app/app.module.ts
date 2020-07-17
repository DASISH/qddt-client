import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

// import { APP_BASE_HREF } from '@angular/common';
import { API_BASE_HREF } from './api';

import { environment } from '../environments/environment';
// import { routing } from './app.routes';
import { ErrorLogService, GlobalErrorHandler, TemplateService } from './lib/services';
import { TokenInterceptor } from './lib/interceptor';
import { AppComponent } from './app.component';
import { CategoryModule } from './modules/category/category.module';
import { ChangeLogModule } from './modules/changelog/changelog.module';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './modules/core/core.module';
import { HomeModule } from './modules/home/home.module';
import { InstructionModule } from './modules/instruction/instruction.module';
import { InstrumentModule } from './modules/instrument/instrument.module';
import { MenuModule } from './modules/menu/menu.module';
import { MissingModule } from './modules/category-missing/missing.module';
import { PageNotFoundComponent } from './components/pagenotfound/page-not-found.component';
import { PreviewModule } from './modules/preview/preview.module';
import { PublicationModule } from './modules/publication/publication.module';
import { QuestionConstructModule } from './modules/construct-question/question-construct.module';
import { QuestionModule } from './modules/question/question.module';
import { ResponsedomainModule } from './modules/responsedomain/responsedomain.module';
import { SelectorDialogsModule } from './modules/selectors-dialog/selectors-dialog.module';
import { SequenceModule } from './modules/construct-sequence/sequence-construct.module';
import { UniverseModule } from './modules/universe/universe.module';
import { UserModule } from './modules/user/user.module';
import { StatementModule } from './modules/construct-statement/statement.module';
import { ConditionModule } from './modules/construct-condition/condition.module';
import { AuthorModule } from './modules/author/author.module';
import { ReferencedModule } from './modules/referenced/referenced.module';
import { AgencyModule } from './modules/agency/agency.module';
import { SearchModule } from './modules/search/search.module';
import { AppRoutingModule } from './app.routes';

// dynamically load languages to support
import('@angular/common/locales/global/nb').then(lang => registerLocaleData(lang.default));
import('@angular/common/locales/global/en-GB').then(lang => registerLocaleData(lang.default, 'en-GB'));
import('@angular/common/locales/global/en-CA').then(lang => registerLocaleData(lang.default, 'en-CA'));
import('@angular/common/locales/global/fr-CA').then(lang => registerLocaleData(lang.default, 'fr-CA'));

@NgModule({
  imports: [BrowserModule, HttpClientModule, DragDropModule, ComponentsModule, CoreModule, BrowserAnimationsModule, HomeModule, MenuModule,
    SelectorDialogsModule, CategoryModule, ResponsedomainModule, QuestionModule, PreviewModule, AuthorModule, ReferencedModule,
    MissingModule, UniverseModule, ChangeLogModule, InstructionModule, InstrumentModule, StatementModule, ConditionModule,
    PublicationModule, QuestionConstructModule, SequenceModule, UserModule, AgencyModule, SearchModule, AppRoutingModule],

  declarations: [AppComponent, PageNotFoundComponent],

  providers: [ErrorLogService, TemplateService,
    { provide: LOCALE_ID, useValue: navigator.language },
    // { provide: APP_BASE_HREF, useValue: environment.APP_BASE },
    { provide: API_BASE_HREF, useValue: environment.API_BASE },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
