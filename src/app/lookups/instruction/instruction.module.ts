import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InstructionComponent } from './instruction.component';
import { InstructionDetailComponent } from './instruction.detail.component';
import { InstructionFormComponent } from './instruction.form.component';
import { InstructionRoutingModule } from './instruction.routes';
import { TemplateModule } from '../../template/template.module';


@NgModule({
    imports: [ SharedModule, TemplateModule, InstructionRoutingModule ],
    declarations: [ InstructionComponent, InstructionDetailComponent, InstructionFormComponent ],
    exports: [ InstructionComponent ],
    providers: [  ]
})

export class InstructionModule { }
