import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';


import { SelectorsModule } from '../selectors/selectors.module';
import { QuestionConstructComponent } from './question-construct.component';
import { QuestionConstructDetailComponent } from './question-construct.detail.component';
import { QuestionConstructFormComponent } from './question-construct.form.component';
import { QuestionConstructRoutingModule } from './question-construct.routes';



@NgModule({
  imports: [ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule, SelectorsModule,
    QuestionConstructRoutingModule],
  declarations: [QuestionConstructComponent, QuestionConstructDetailComponent, QuestionConstructFormComponent],
  exports: [QuestionConstructComponent],
  providers: []
})

export class QuestionConstructModule { }
