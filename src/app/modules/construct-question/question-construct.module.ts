import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { QuestionModule } from '../question/question.module';
import { QuestionConstructComponent } from './question-construct.component';
import { QuestionConstructDetailComponent } from './question-construct.detail.component';
import { QuestionConstructFormComponent } from './question-construct.form.component';
import { QuestionConstructRoutingModule } from './question-construct.routes';
import { SelectorDialogsModule } from '../selectors-dialog/selectors-dialog.module';

@NgModule({
  imports: [ComponentsModule, ResponsedomainModule, QuestionModule, PreviewModule, SelectorDialogsModule,
    QuestionConstructRoutingModule],
  declarations: [QuestionConstructComponent, QuestionConstructDetailComponent, QuestionConstructFormComponent],
  exports: [QuestionConstructComponent],
  providers: []
})

export class QuestionConstructModule { }
