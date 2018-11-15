import { Component, Input } from '@angular/core';
import {Concept, ElementKind} from '../../classes';
import {MessageService} from '../../modules/core/services';

@Component({
  selector: 'qddt-preview-concept',

  styles: [
  ],
  templateUrl: 'preview.concept.component.html',
  providers: [ ],
})

export class PreviewConceptComponent {
  @Input() concept: Concept;

  constructor(private  message: MessageService) {
  }

  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onClickTopic(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP]} );
  }


}
