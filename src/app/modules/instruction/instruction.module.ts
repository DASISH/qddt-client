import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { InstructionComponent } from './instruction.component';
import { InstructionDetailComponent } from './instruction.detail.component';
import { InstructionFormComponent } from './instruction.form.component';
import { InstructionRoutingModule } from './instruction.routes';


@NgModule({
  imports: [ComponentsModule, InstructionRoutingModule],
  declarations: [InstructionComponent, InstructionDetailComponent, InstructionFormComponent],
  exports: [InstructionComponent],
  providers: []
})

export class InstructionModule { }
