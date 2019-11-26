import { Component, Input } from '@angular/core';
import {ElementKind} from '../../lib';
import {MessageService} from '../../lib/services';

@Component({
  selector: 'qddt-conceptref',

  templateUrl: 'conceptref.component.html',
})
export class ConceptrefComponent  {
  @Input() element: any;

  public showRefs = false;

  constructor(private  message: MessageService) {
  }

  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onClickTopic(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP]} );
  }

  onClickConcept(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.CONCEPT]} );
  }

  getRefRoot(): any {
    return this.element.conceptRefs;
  }

}
