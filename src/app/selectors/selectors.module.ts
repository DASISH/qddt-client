import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PreviewModule } from '../preview/preview.module';
import { SelectorsService } from './selectors.service';
import { ItemSearchComponent } from './searchitem/item-search.component';
import { ItemSearchSelectComponent } from './selector/item-search-select.component';
import { RevisionSelectComponent } from './selectrevision/revision-select.component';



@NgModule({
  imports: [ SharedModule, PreviewModule],
  declarations: [
    ItemSearchComponent, ItemSearchSelectComponent, RevisionSelectComponent
  ],
  exports: [
    ItemSearchComponent, ItemSearchSelectComponent, RevisionSelectComponent
  ],
  providers: [ SelectorsService ]
})

export class SelectorsModule { }
