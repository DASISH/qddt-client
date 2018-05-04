import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-instrument',
  moduleId: module.id,
  templateUrl: './instrument.component.html'
})
export class InstrumentComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    console.log(event);
    this.templateDetail.onToggleForm();
  }

}
