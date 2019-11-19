import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ElementRevisionComponent } from './element-revision/element-revision.component';
import { RevisionComponent } from './revision/revision.component';
import { CollectionSearchRevisionSelectComponent } from './search-revisioncollection/collection-search-revision.select.component';
import { CollectionSearchSelectComponent } from './search-collection/collection-search.select.component';
import { ResponsedomainComponent } from '../selectors-dialog/responsedomain/responsedomain.component';


@NgModule({
  imports: [ComponentsModule, PreviewModule],
  declarations: [ElementRevisionComponent, CollectionSearchSelectComponent,
    RevisionComponent, CollectionSearchRevisionSelectComponent, ResponsedomainComponent
  ],
  exports: [
    CollectionSearchSelectComponent, RevisionComponent, ElementRevisionComponent, CollectionSearchRevisionSelectComponent,
    ResponsedomainComponent
  ],
  providers: []
})

export class SelectorsModule { }
