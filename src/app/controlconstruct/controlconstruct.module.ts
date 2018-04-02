import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { ConceptrefModule } from '../shared/conceptref/conceptref.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';
import { QuestionConstructListComponent } from './question/questionconstruct-list.component';
import { QuestionConstructDetailComponent } from './question/questionconstruct.detail.component';
import { QuestionConstructFormComponent } from './question/questionconstruct.form.component';

import { SequenceConstructComponent } from './sequence/sequenceconstruct.component';
import { SequenceContentComponent } from './sequence/sequenceconstruct.content.component';
import { SequenceDetailComponent } from './sequence/sequenceconstruct.detail.component';
import { SequenceEditComponent } from './sequence/sequenceconstruct.edit.component';
import { SequenceReuseComponent } from './sequence/sequenceconstruct.reuse.component';

import { ConditionEditComponent } from './condition/conditionconstruct.edit.component';
import { InstructionComponent } from './instruction/instruction.component';
import { StatementEditComponent } from './statement/statementconstruct.edit.component';
import { UniverseComponent } from './universe/universe.component';
import { ControlConstructService } from './controlconstruct.service';
import { ControlConstructComponent } from './controlconstruct.component';
import { ControlConstructRoutingModule } from './controlconstruct.routes';



@NgModule({
  imports: [ SharedModule, ResponsedomainModule, QuestionModule, PreviewModule, ConceptrefModule, ControlConstructRoutingModule],
  declarations: [ ControlConstructComponent,
    QuestionConstructFormComponent, QuestionConstructDetailComponent, QuestionConstructListComponent,
    SequenceConstructComponent, SequenceContentComponent, SequenceDetailComponent, SequenceEditComponent,
    SequenceReuseComponent,
    ConditionEditComponent,  StatementEditComponent, InstructionComponent, UniverseComponent ],
  exports: [ ControlConstructComponent ],
  providers: [ ControlConstructService ]
})

export class ControlConstructModule { }
