import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { QuestionItemsComponent } from './question-items/question-items.component';

@NgModule({
  imports: [ ComponentsModule, PreviewModule, SelectorsModule ],
  declarations: [  QuestionItemsComponent],
  exports: [  QuestionItemsComponent ],
  providers: [  ]
})

export class SelectorDialogsModule { }
