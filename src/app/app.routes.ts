import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guard/auth-guard.service';
import { QuestionComponent } from './question/question.component';
import { CategoryComponent } from './category/category.component';
import { CategorySchemeComponent } from './category/category.scheme.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { PublicationComponent } from './publication/publication.component';
import { LoginComponent } from './core/login/login.component';
import { ResponsedomainComponent } from './responsedomain/responsedomain.component';
import { ControlConstructComponent } from './controlconstruct/controlconstruct.component';
import { SequenceComponent } from './sequence/sequence.component';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';


const appRoutes: Routes = [
  { path: 'home', redirectTo: '/survey', pathMatch: 'full'},
  { path: 'login',        component: LoginComponent },
  { path: 'questions',    component: QuestionComponent, canActivate: [AuthGuard] },
  { path: 'responsedomains', component: ResponsedomainComponent, canActivate: [AuthGuard] },
  { path: 'schemes',      component: CategorySchemeComponent, canActivate: [AuthGuard] },
  { path: 'constructs',   component: ControlConstructComponent , canActivate: [AuthGuard]},
  { path: 'categories',   component: CategoryComponent , canActivate: [AuthGuard]},
  { path: 'instruments',  component: InstrumentComponent , canActivate: [AuthGuard]},
  { path: 'sequences',    component: SequenceComponent, canActivate: [AuthGuard]},
  { path: 'publications', component: PublicationComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, {enableTracing: false});
