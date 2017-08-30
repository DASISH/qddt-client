import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PreviewModule } from '../../common/preview/preview.module';
import { ConceptrefComponent } from './conceptref.component';


@NgModule({
  imports: [ SharedModule,  PreviewModule],
  declarations: [ ConceptrefComponent ],
  exports: [ConceptrefComponent]
})

export class ConceptrefModule { }
