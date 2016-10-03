import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeCmp }   from './components/home/home.component';
//import { QuestionComp } from './components/question/question.component';
//import { ConceptComponent } from './components/concept/concept.component';
import { CategoryComponent } from './components/category/category.component';
//import { CategorySchemeComponent } from './components/category/category.scheme.component';
//import { ResponsedomainComponent } from './components/responsedomain/responsedomain.component';
//import { ControlConstructComponent } from './components/controlconstruct/controlconstruct.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeCmp
  },
  /*{
    path: 'Questions',
    component: QuestionComp
  },
  {
    path: 'concept',
    component: ConceptComponent
  },
  {
    path: 'Responsedomains',
    component: ResponsedomainComponent
  },
  {
    path: 'Schemes',
    component: CategorySchemeComponent
  },
  {
    path: 'Constructs',
    component: ControlConstructComponent
  },*/
  {
    path: 'Categories',
    component: CategoryComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
