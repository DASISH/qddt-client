import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { MessageService } from '../core/services/message.service';
import { IElement, IEntityAudit } from '../shared/classes/interfaces';
import { ElementRevisionRef } from '../shared/classes/classes';

@Component({
  selector: 'qddt-sequence-content',
  templateUrl: './sequence-construct.content.component.html',
  styles: [
    '.control-children { padding-left: 20px }',
  ],
})

export class SequenceContentComponent implements OnChanges{
  @Input() sequence: ElementRevisionRef[];


  constructor( private message: MessageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sequence']) {
      console.log('repaint???');
    }
  }


  onSelectedElement(element: IEntityAudit) {
    const  ref: IElement =  {
      element: element,
      elementKind: element.classKind };
    this.message.sendMessage( ref );
  }


}
