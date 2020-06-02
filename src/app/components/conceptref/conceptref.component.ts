import { Component, Input } from '@angular/core';
import { ElementKind, IParentRef, QuestionItem } from '../../lib';
import { MessageService } from '../../lib/services';

@Component({
  selector: 'qddt-conceptref',

  templateUrl: 'conceptref.component.html',
})
export class ConceptrefComponent {
  @Input() element: QuestionItem;

  public showRefs = false;

  constructor(private message: MessageService) {
  }

  onClickStudy(id: string) {
    this.message.sendMessage({ elementId: id, elementKind: ElementKind[ElementKind.STUDY] });
  }

  onClickTopic(id: string) {
    this.message.sendMessage({ elementId: id, elementKind: ElementKind[ElementKind.TOPIC_GROUP] });
  }

  onClickConcept(id: string) {
    this.message.sendMessage({ elementId: id, elementKind: ElementKind[ElementKind.CONCEPT] });
  }

  getRefRoot(): IParentRef[] {
    return this.element.parentRefs
      .map(ref => (ref.parentRef.parentRef) ? ref : { parentRef: ref, id: null, name: null } as IParentRef);
  }

}
