import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniverseComponent } from './universe.component';
import { UniverseDetailComponent } from './universe.detail.component';
import { AuthGuard} from '../core/services';
import { TemplateListComponent} from '../../components/template';


export const universeRoutes: Routes = [
  {
    path: '',
    component: UniverseComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'universes', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'universes/:id', component: UniverseDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(universeRoutes) ],
  exports: [ RouterModule ]
})
export class UniverseRoutingModule {}
