import { Component, Input, OnChanges } from '@angular/core';
import { Concept } from '../../home/home.service';
import { QddtMessageService } from '../../core/global/message.service';
import { ElementKind } from '../../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-preview-concept',
  moduleId: module.id,
  styles: [
      'div.collapsible { margin:10px;}',
      'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }'
  ],
  templateUrl: 'preview.concept.component.html',
  providers: [ ],
})

export class PreviewConceptComponent {
  @Input() concept: Concept;

  constructor(private  message: QddtMessageService) {
  }

  onClickStudy(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.STUDY]} );
  }

  onClickTopic(id: string) {
    this.message.sendMessage( { elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP]} );
  }


}
