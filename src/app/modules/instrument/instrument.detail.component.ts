import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-detail.instrument',

  templateUrl: 'instrument.detail.component.html'
})

export class InstrumentDetailComponent  {
  @ViewChild('detail', {static: true}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}
