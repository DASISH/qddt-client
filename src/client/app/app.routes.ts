import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent }   from './components/home/home.component';
import { QuestionComponent } from './components/question/question.component';
import { CategoryComponent } from './components/category/category.component';
import { CategorySchemeComponent } from './components/category/category.scheme.component';
import { ResponsedomainComponent } from './components/responsedomain/responsedomain.component';
import { ControlConstructComponent } from './components/controlconstruct/controlconstruct.component';
import { InstrumentComponent } from './components/instrument/instrument.component';
import { SequenceComponent } from './components/sequence/sequence.component';
import { PublicationComponent } from './components/publication/publication.component';
import { AuthGuard } from './auth/auth.guard';
// import { PageNotFoundComponent } from './components/pagenotfound/page-not-found.component';
// import { AuthGuard } from './auth-guard.service';

const appRoutes: Routes = [
  { path: 'questions',  component: QuestionComponent,canActivate: [AuthGuard] },
  { path: 'responsedomains',component: ResponsedomainComponent,canActivate: [AuthGuard] },
  { path: 'schemes',    component: CategorySchemeComponent,canActivate: [AuthGuard] },
  { path: 'constructs', component: ControlConstructComponent ,canActivate: [AuthGuard]},
  { path: 'categories', component: CategoryComponent ,canActivate: [AuthGuard]},
  { path: 'instruments',component: InstrumentComponent ,canActivate: [AuthGuard]},
  { path: 'sequences',  component: SequenceComponent,canActivate: [AuthGuard]},
  { path: 'publications', component: PublicationComponent, canActivate: [AuthGuard]},
  { path: 'home',       component: HomeComponent ,canActivate: [AuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full'}
  // { path: '**', component: PageNotFoundComponent }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(
  appRoutes
  ,{enableTracing: true});
