import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatementComponent } from './statement.component';
import { StatementDetailComponent } from './statement.detail.component';
import { AuthGuard} from '../../lib/services';
import { TemplateListComponent} from '../../components/template';


export const statementRoutes: Routes = [
  {
    path: '',
    component: StatementComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'statements', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'statements/:id', component: StatementDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(statementRoutes) ],
  exports: [ RouterModule ]
})
export class StatementRoutingModule {}
