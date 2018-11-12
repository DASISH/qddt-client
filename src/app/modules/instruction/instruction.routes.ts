import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionComponent } from './instruction.component';
import { InstructionDetailComponent } from './instruction.detail.component';
import { AuthGuard} from '../core/services';
import { TemplateListComponent} from '../../components/template';


export const instructionRoutes: Routes = [
  {
    path: '',
    component: InstructionComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'instructions', component: TemplateListComponent, canActivate: [AuthGuard], },
      { path: 'instructions/:id', component: InstructionDetailComponent, canActivate: [AuthGuard], },
    ],
  }
];

@NgModule({
  imports: [ RouterModule.forChild(instructionRoutes) ],
  exports: [ RouterModule ]
})
export class InstructionRoutingModule {}
