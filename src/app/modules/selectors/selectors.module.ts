import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { PreviewModule } from '../preview/preview.module';
import { ElementRevisionComponent } from './element-revision/element-revision.component';
import { RevisionComponent } from './revision/revision.component';
import { ElementComponent } from './element/element.component';


@NgModule({
  imports: [ComponentsModule, PreviewModule],
  declarations: [ElementRevisionComponent, RevisionComponent, ElementComponent ],
  exports: [RevisionComponent, ElementRevisionComponent, ElementComponent ],
  providers: []
})

export class SelectorsModule { }
