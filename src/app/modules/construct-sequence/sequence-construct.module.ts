import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';

import { SelectorsModule } from '../selectors/selectors.module';
import { SequenceFormComponent } from './sequence-construct.form.component';
import { SequenceDetailComponent } from './sequence-construct.detail.component';
import { SequenceContentComponent } from './sequence-construct.content.component';
import { SequenceConstructComponent } from './sequence-construct.component';
import { SequenceRoutingModule } from './sequence-construct.routes';



@NgModule({
  imports: [ ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule,
  SelectorsModule, SequenceRoutingModule ],
  declarations: [ SequenceFormComponent, SequenceDetailComponent, SequenceContentComponent,
      SequenceConstructComponent ],
  exports: [ SequenceConstructComponent ],
  providers: [  ]
})

export class SequenceModule { }
