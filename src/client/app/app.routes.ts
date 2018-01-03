import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth-guard.service';
import { HomeComponent }   from './home/home.component';
import { QuestionComponent } from './question/question.component';
import { CategoryComponent } from './category/category.component';
import { CategorySchemeComponent } from './category/category.scheme.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { PublicationComponent } from './publication/publication.component';
import { LoginComponent } from './auth/login/login.component';
import { ResponsedomainComponent } from './responsedomain/responsedomain.component';
import { ControlConstructComponent } from './controlconstruct/controlconstruct.component';
import { SequenceComponent } from './sequence/sequence.component';
import { PageNotFoundComponent } from './pagenotfound/page-not-found.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home',         component: HomeComponent ,canActivate: [AuthGuard]},
  { path: 'login',        component: LoginComponent ,canActivate: [AuthGuard]},
  { path: 'questions',    component: QuestionComponent,canActivate: [AuthGuard] },
  { path: 'responsedomains',component: ResponsedomainComponent,canActivate: [AuthGuard] },
  { path: 'schemes',      component: CategorySchemeComponent,canActivate: [AuthGuard] },
  { path: 'constructs',   component: ControlConstructComponent ,canActivate: [AuthGuard]},
  { path: 'categories',   component: CategoryComponent ,canActivate: [AuthGuard]},
  { path: 'instruments',  component: InstrumentComponent ,canActivate: [AuthGuard]},
  { path: 'sequences',    component: SequenceComponent,canActivate: [AuthGuard]},
  { path: 'publications', component: PublicationComponent, canActivate: [AuthGuard]},
  { path: '**', component: PageNotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{enableTracing: true});
