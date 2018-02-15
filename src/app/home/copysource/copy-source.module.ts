import { NgModule } from '@angular/core';
import { PreviewModule } from '../../preview/preview.module';
import { CopySourceComponent } from './copy-source.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [SharedModule, PreviewModule],
  declarations: [CopySourceComponent],
  exports: [CopySourceComponent]
})

export class CopySourceModule { }
