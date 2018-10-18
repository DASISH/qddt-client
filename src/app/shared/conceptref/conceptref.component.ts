import { Component, Input } from '@angular/core';
import { QddtMessageService } from '../../core/services/message.service';
import { ElementKind } from '../classes/enums';

@Component({
  selector: 'qddt-conceptref',
  moduleId: module.id,
  templateUrl: 'conceptref.component.html',
})
export class ConceptrefComponent  {
  @Input() element: any;

  private showRefs = false;

  constructor(private  message: QddtMessageService) {
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
