import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { QuestionItemsComponent } from './question-items/question-items.component';
import { ResponsedomainComponent } from './responsedomain/responsedomain.component';
import { ElementCollectionComponent } from './element-collection/element-collection.component';
import { ElementRevisionCollectionComponent } from './element-revision-collection/element-revision-collection.component';
import { ElementRevisionSelectComponent} from './element-revision/element-revision.component';
import { ElementRevisionRefComponent} from './element-revision-ref/element-revision-ref.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [ ComponentsModule, PreviewModule, SelectorsModule, DragDropModule ],
  declarations: [  QuestionItemsComponent, ResponsedomainComponent, ElementCollectionComponent, ElementRevisionCollectionComponent,
    ElementRevisionSelectComponent, ElementRevisionRefComponent ],
  exports: [  QuestionItemsComponent, ResponsedomainComponent, ElementCollectionComponent, ElementRevisionCollectionComponent,
    ElementRevisionSelectComponent, ElementRevisionRefComponent],
  providers: [  ]
})

export class SelectorDialogsModule { }
