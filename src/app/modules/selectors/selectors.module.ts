import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ElementRevisionSelectComponent } from './element-revision/element-revision.select.component';
import { RevisionResultSelectComponent } from './revision-result/revision-result.select.component';
import { CollectionSearchRevisionSelectComponent } from './search-revisioncollection/collection-search-revision.select.component';
import { CollectionSearchSelectComponent } from './search-collection/collection-search.select.component';
import { ResponsedomainSelectComponent } from './responsedomain/responsedomain.select.component';


@NgModule({
  imports: [ComponentsModule, PreviewModule],
  declarations: [ElementRevisionSelectComponent, CollectionSearchSelectComponent,
    RevisionResultSelectComponent, CollectionSearchRevisionSelectComponent, ResponsedomainSelectComponent
  ],
  exports: [
    CollectionSearchSelectComponent, RevisionResultSelectComponent, ElementRevisionSelectComponent, CollectionSearchRevisionSelectComponent,
    ResponsedomainSelectComponent
  ],
  providers: []
})

export class SelectorsModule { }
