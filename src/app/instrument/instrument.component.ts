import { Component, ViewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Factory } from '../shared/elementfactory/factory';
import { ElementKind } from '../shared/elementinterfaces/elements';

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
