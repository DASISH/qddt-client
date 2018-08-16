import { Component, Input } from '@angular/core';
import { QddtMessageService } from '../../core/global/message.service';
import { Concept } from '../../home/home.classes';
import { ElementKind } from '../../shared/classes/enums';

@Component({
  selector: 'qddt-preview-concept',
  moduleId: module.id,
  styles: [
    'ul { margin-right:10px; padding:1px; border-color:lightyellow; }',
    'ul.question { padding:none; border-color:#E8F5E9;}',
    'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }',
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
