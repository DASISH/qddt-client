import { NgModule } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { CollectionSearchSelectComponent } from './searchcollection/collection-search-select.component';
import { RevisionSelectComponent } from './selectrevision/revision-select.component';
import { CollectionSearchRevisionSelectComponent } from './searchcollectionrevisoin/collection-search-revision-select.component';
import { ItemRevisionSelectComponent } from './selectitemrevision/item-revision-select.component';


@NgModule({
  imports: [ ComponentsModule, PreviewModule],
  declarations: [ ItemRevisionSelectComponent, CollectionSearchSelectComponent,
    RevisionSelectComponent, CollectionSearchRevisionSelectComponent,
  ],
  exports: [
    CollectionSearchSelectComponent, RevisionSelectComponent, ItemRevisionSelectComponent, CollectionSearchRevisionSelectComponent
  ],
  providers: [  ]
})

export class SelectorsModule { }
