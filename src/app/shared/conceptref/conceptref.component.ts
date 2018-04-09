import { Component, Input,  EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { QddtMessageService } from '../../core/global/message.service';
import { IRevisionRef, IElementRef, ElementKind } from '../../shared/elementinterfaces/elements';

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
