import { Component, Input } from '@angular/core';
import {Concept, ElementKind, ElementRevisionRef, MessageService, PreviewService} from '../../../lib';

@Component({
  selector: 'qddt-preview-concept',

  styles: [
  ],
  templateUrl: 'preview.concept.component.html',
  providers: [ ],
})

export class PreviewConceptComponent {
  @Input() concept: Concept;

  constructor(private  message: MessageService, private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }
  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onClickTopic(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP]} );
  }


}
