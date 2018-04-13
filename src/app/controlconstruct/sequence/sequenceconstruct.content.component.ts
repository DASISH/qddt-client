import { Component, Input } from '@angular/core';
import { QddtMessageService} from '../../core/global/message.service';
import { IElement, IEntityAudit } from '../../shared/classes/interfaces';

@Component({
  selector: 'qddt-sequence-content',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.content.component.html',
  styles: [
    '.control-children { padding-left: 20px }',
  ],
})

export class SequenceContentComponent {
  @Input() sequence: IEntityAudit;


  constructor( private message: QddtMessageService) { }

  onSelectedElement(element: IEntityAudit) {
    const  ref: IElement =  {
      element: element,
      elementKind: element.classKind };
    this.message.sendMessage( ref );
  }

}
