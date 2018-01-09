import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../shared/preview/preview.module';
import { ControlConstructComponent } from './controlconstruct.component';
import { ControlConstructDetailComponent } from './controlconstruct.detail.component';
import { ControlConstructQuestionItemSelectComponent } from './controlconstruct.questionitem.select.component';
import { ControlConstructFormComponent } from './controlconstruct.form.component';
import { ConceptrefModule } from '../shared/conceptref/conceptref.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';
import { InstructionComponent } from './instruction.component';
import { UniverseComponent } from './universe.component';


@NgModule({
  imports: [ SharedModule, ResponsedomainModule, QuestionModule, PreviewModule, ConceptrefModule],
  declarations: [ControlConstructComponent, ControlConstructFormComponent,
    ControlConstructQuestionItemSelectComponent, ControlConstructDetailComponent,
    InstructionComponent, UniverseComponent
    ],
  exports: [ControlConstructComponent]
})

export class ControlConstructModule { }
