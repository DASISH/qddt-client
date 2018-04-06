import { Component, Input } from '@angular/core';
import { IEntityAudit } from '../../shared/elementinterfaces/entityaudit';
import { IElementRef } from '../../shared/elementinterfaces/elements';
import { QddtMessageService} from '../../core/global/message.service';

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
    const  ref: IElementRef =  {
      element: element,
      elementKind: element.classKind };
    this.message.sendMessage( ref );
  }

}
