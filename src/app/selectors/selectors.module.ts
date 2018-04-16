import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { CollectionSearchSelectComponent } from './searchcollection/collection-search-select.component';
import { RevisionSelectComponent } from './selectrevision/revision-select.component';
import { CollectionSearchRevisionSelectComponent } from './searchcollectionrevisoin/collection-search-revision-select.component';
import { ItemRevisionSelectComponent } from './selectitemrevision/item-revision-select.component';


@NgModule({
  imports: [ SharedModule, PreviewModule],
  declarations: [ ItemRevisionSelectComponent,
     CollectionSearchSelectComponent, RevisionSelectComponent, CollectionSearchRevisionSelectComponent,
  ],
  exports: [
    CollectionSearchSelectComponent, RevisionSelectComponent, ItemRevisionSelectComponent
  ],
  providers: [  ]
})

export class SelectorsModule { }
