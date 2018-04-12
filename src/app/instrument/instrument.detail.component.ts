import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-detail.instrument',
  moduleId: module.id,
  templateUrl: 'instrument.detail.component.html'
})

export class InstrumentDetailComponent  {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}
