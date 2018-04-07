import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentDetailComponent } from './instrument.detail.component';
import { InstrumentRoutingModule } from './instrument.routes';
import { InstrumentService } from './instrument.service';
import { TemplateModule } from '../template/template.module';


@NgModule({
  imports: [ SharedModule, TemplateModule, InstrumentRoutingModule],
  declarations: [InstrumentComponent, InstrumentDetailComponent],
  exports: [InstrumentComponent],
  providers: [InstrumentService]
})

export class InstrumentModule { }
