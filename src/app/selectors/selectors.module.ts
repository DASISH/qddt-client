import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsService } from './selectors.service';
import { ItemSearchComponent } from './searchitem/item-search.component';
import { CollectionSearchSelectComponent } from './searchcollection/collection-search-select.component';
import { RevisionSelectComponent } from './selectrevision/revision-select.component';
import { CollectionSearchRevisionSelectComponent } from './searchcollectionrevisoin/collection-search-revision-select.component';


@NgModule({
  imports: [ SharedModule, PreviewModule],
  declarations: [
    ItemSearchComponent, CollectionSearchSelectComponent, RevisionSelectComponent, CollectionSearchRevisionSelectComponent,
  ],
  exports: [
    ItemSearchComponent, CollectionSearchSelectComponent, RevisionSelectComponent
  ],
  providers: [ SelectorsService ]
})

export class SelectorsModule { }
