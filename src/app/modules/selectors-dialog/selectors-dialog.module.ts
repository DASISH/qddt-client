import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { QuestionReuseComponent } from './question/question.reuse.component';
import { ResponsedomainSelectComponent } from '../selectors/selectresponsdomain/responsdomain.select.component';

@NgModule({
  imports: [ ComponentsModule, PreviewModule, SelectorsModule ],
  declarations: [  QuestionReuseComponent, ResponsedomainSelectComponent ],
  exports: [  QuestionReuseComponent, ResponsedomainSelectComponent ],
  providers: [  ]
})

export class SelectorDialogsModule { }
