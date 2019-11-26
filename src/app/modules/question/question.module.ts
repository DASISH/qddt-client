import { NgModule } from '@angular/core';
import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question.detail.component';
import { QuestionFormComponent } from './question.form.component';
import { ResponsedomainModule } from '../responsedomain/responsedomain.module';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { QuestionRoutingModule } from './question.route';
import { SelectorsModule } from '../selectors/selectors.module';
import { SelectorDialogsModule } from '../selectors-dialog/selectors-dialog.module';


@NgModule({
  imports: [ ComponentsModule, ResponsedomainModule, PreviewModule, SelectorsModule, SelectorDialogsModule,
    QuestionRoutingModule],
  declarations: [QuestionComponent, QuestionDetailComponent, QuestionFormComponent],
  exports: [QuestionComponent, QuestionFormComponent, QuestionDetailComponent ],
  providers: []
})

export class QuestionModule { }
