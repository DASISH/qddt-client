import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';

import { QuestionConstructDetailComponent } from './question/questionconstruct.detail.component';
import { QuestionConstructFormComponent } from './question/questionconstruct.form.component';

import { SequenceContentComponent } from './sequence/sequenceconstruct.content.component';
import { SequenceDetailComponent } from './sequence/sequenceconstruct.detail.component';
import { SequenceFormComponent} from './sequence/sequenceconstruct.form.component';

import { ConditionEditComponent } from './condition/conditionconstruct.edit.component';
import { InstructionComponent } from './instruction/instruction.component';
import { StatementEditComponent } from './statement/statementconstruct.edit.component';
import { UniverseComponent } from './universe/universe.component';

import { ControlConstructService } from './controlconstruct.service';
import { ControlConstructComponent } from './controlconstruct.component';
import { ControlConstructRoutingModule } from './controlconstruct.routes';
import { SelectorsModule } from '../selectors/selectors.module';
import { TemplateModule } from '../template/template.module';



@NgModule({
  imports: [ SharedModule, ResponsedomainModule, QuestionModule, PreviewModule, ControlConstructRoutingModule,
  SelectorsModule, TemplateModule ],
  declarations: [ ControlConstructComponent,
    QuestionConstructDetailComponent, QuestionConstructFormComponent,
    SequenceDetailComponent, SequenceFormComponent, SequenceContentComponent,
    ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  exports: [ ControlConstructComponent ],
  providers: [ ControlConstructService ]
})

export class ControlConstructModule { }
