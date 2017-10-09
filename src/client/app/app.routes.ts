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

const appRoutes: Routes = [
  { path: 'home',       component: HomeComponent },
  { path: 'questions',  component: QuestionComponent },
  { path: 'responsedomains',component: ResponsedomainComponent },
  { path: 'schemes',    component: CategorySchemeComponent },
  { path: 'constructs', component: ControlConstructComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'instruments',component: InstrumentComponent },
  { path: 'sequences',  component: SequenceComponent},
  { path: 'publications', component: PublicationComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
