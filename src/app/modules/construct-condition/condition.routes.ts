import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConditionComponent } from './condition.component';
import { ConditionDetailComponent } from './condition.detail.component';
import { AuthGuard} from '../../lib/services';
import { TemplateListComponent} from '../../components/template';


export const conditionRoutes: Routes = [
  {
    path: '',
    component: ConditionComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'conditions', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'conditions/:id', component: ConditionDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(conditionRoutes) ],
  exports: [ RouterModule ]
})
export class ConditionRoutingModule {}
