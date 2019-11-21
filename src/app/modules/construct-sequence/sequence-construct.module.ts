import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';

import { SequenceFormComponent } from './sequence-construct.form.component';
import { SequenceDetailComponent } from './sequence-construct.detail.component';
import { SequenceContentComponent } from './sequence-construct.content.component';
import { SequenceConstructComponent } from './sequence-construct.component';
import { SequenceRoutingModule } from './sequence-construct.routes';
import {SelectorDialogsModule} from '../selectors-dialog/selectors-dialog.module';



@NgModule({
  imports: [ ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule,
    SelectorDialogsModule, SequenceRoutingModule ],
  declarations: [ SequenceFormComponent, SequenceDetailComponent, SequenceContentComponent,
      SequenceConstructComponent ],
  exports: [ SequenceConstructComponent ],
  providers: [  ]
})

export class SequenceModule { }
