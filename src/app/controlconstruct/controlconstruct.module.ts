import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';


import { ConditionEditComponent } from './condition/conditionconstruct.edit.component';
import { InstructionComponent } from './instruction/instruction.component';
import { StatementEditComponent } from './statement/statementconstruct.edit.component';
import { UniverseComponent } from './universe/universe.component';

import { SelectorsModule } from '../selectors/selectors.module';
import { TemplateModule } from '../template/template.module';



@NgModule({
  imports: [ SharedModule, ResponsedomainModule, QuestionModule, PreviewModule,
  SelectorsModule, TemplateModule ],
  declarations: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  exports: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  providers: [  ]
})

export class ControlConstructModule { }
