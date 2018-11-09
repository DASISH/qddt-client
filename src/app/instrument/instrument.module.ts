import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentRoutingModule } from './instrument.routes';
import { TemplateModule } from '../template/template.module';
import { InstrumentFormComponent } from './instrument.form.component';
import { InstrumentDetailComponent } from './instrument.detail.component';
import { PreviewModule } from '../preview/preview.module';
import { InstrumentSequenceComponent } from './instrument-sequence.component';
import { SelectorsModule } from '../selectors/selectors.module';


@NgModule({
  imports: [ SharedModule, TemplateModule, InstrumentRoutingModule, PreviewModule, SelectorsModule ],
  declarations: [ InstrumentComponent, InstrumentFormComponent, InstrumentDetailComponent, InstrumentSequenceComponent ],
  exports: [ InstrumentComponent ],
  providers: [  ]
})

export class InstrumentModule { }
