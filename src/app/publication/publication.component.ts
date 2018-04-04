import { Component } from '@angular/core';
import { Factory } from '../shared/elementfactory/factory';
import { ElementKind } from '../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-publication',
  moduleId: module.id,
  templateUrl: './publication.component.html'
})
export class PublicationComponent  {

  public newItem =  Factory.createInstance(ElementKind.PUBLICATION);

}
