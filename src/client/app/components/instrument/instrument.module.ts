import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { InstrumentComponent } from './instrument.component';
import { InstrumentDetailComponent } from './instrument.detail.component';


@NgModule({
  imports: [ SharedModule],
  declarations: [InstrumentComponent, InstrumentDetailComponent],
  exports: [InstrumentComponent]
})

export class InstrumentModule { }
