import { NgModule } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../modules/responsedomain/responsedomain.module';
import { QuestionModule } from '../modules/question/question.module';

import { ConditionEditComponent } from './condition/conditionconstruct.edit.component';
import { InstructionComponent } from './instruction/instruction.component';
import { StatementEditComponent } from './statement/statementconstruct.edit.component';
import { UniverseComponent } from './universe/universe.component';

import { SelectorsModule } from '../selectors/selectors.module';



@NgModule({
  imports: [ ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule, SelectorsModule ],
  declarations: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  exports: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  providers: [  ]
})

export class ControlConstructModule { }
