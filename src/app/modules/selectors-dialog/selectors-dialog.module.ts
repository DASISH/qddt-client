import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsModule } from '../selectors/selectors.module';
import { QuestionItemsComponent } from './question-items/question-items.component';
import { ResponsedomainComponent } from './responsedomain/responsedomain.component';
import { ElementCollectionComponent } from './element-collection/element-collection.component';
import { ElementRevisionCollectionComponent } from './element-revision-collection/element-revision-collection.component';
import { ConstructsComponent } from './constructs/constructs.component';
import { ElementRevisionSelectComponent} from './element-revision/element-revision.component';
import { ElementRevisionRefComponent} from './element-revision-ref/element-revision-ref.component';

@NgModule({
  imports: [ ComponentsModule, PreviewModule, SelectorsModule ],
  declarations: [  QuestionItemsComponent, ResponsedomainComponent, ElementCollectionComponent, ElementRevisionCollectionComponent,
    ConstructsComponent, ElementRevisionSelectComponent, ElementRevisionRefComponent ],
  exports: [  QuestionItemsComponent, ResponsedomainComponent, ElementCollectionComponent, ElementRevisionCollectionComponent,
    ConstructsComponent, ElementRevisionSelectComponent, ElementRevisionRefComponent],
  providers: [  ]
})

export class SelectorDialogsModule { }
