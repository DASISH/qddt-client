import { Component, Input } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { Concept } from '../../home/home.classes';
import { ElementKind } from '../../shared/classes/enums';

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
