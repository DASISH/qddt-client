import { Component } from '@angular/core';
import { Factory } from '../shared/elementfactory/factory';
import { ElementKind } from '../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-instrument',
  moduleId: module.id,
  templateUrl: './instrument.component.html'
})
export class InstrumentComponent  {

  public newItem =  Factory.createInstance(ElementKind.INSTRUMENT);

}
