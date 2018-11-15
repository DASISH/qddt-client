import { NgModule } from '@angular/core';

import { ComponentsModule} from '../../components/components.module';
import { PreviewModule} from '../../preview/preview.module';
import { SelectorsModule} from '../../selectors/selectors.module';
import { QuestionModule} from '../question/question.module';
import { ResponsedomainModule} from '../responsedomain/responsedomain.module';
import { ConditionEditComponent } from './condition/conditionconstruct.edit.component';
import { InstructionComponent } from './instruction/instruction.component';
import { StatementEditComponent } from './statement/statementconstruct.edit.component';
import { UniverseComponent } from './universe/universe.component';



@NgModule({
  imports: [ ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule, SelectorsModule ],
  declarations: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  exports: [ ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  providers: [  ]
})

export class ControlConstructModule { }
