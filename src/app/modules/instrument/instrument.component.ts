import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-instrument',

  templateUrl: './instrument.component.html'
})
export class InstrumentComponent {
  @ViewChild('detail', { static: true }) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }

}
