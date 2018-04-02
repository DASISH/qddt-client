import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';

@Component({
  selector: 'qddt-sequence-content',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.content.component.html',
  styles: [
    '.control-children { padding-left: 20px }',
  ],
})

export class SequenceContentComponent {
  @Input() sequence: SequenceConstruct;
  selectedElement: any;
  sequenceContentActions = new EventEmitter<any>();

  constructor(private service: ControlConstructService) {
  }


  onSelectedElement(element: any) {
    this.selectedElement = element;
    this.sequenceContentActions.emit({action: 'modal', params: ['open']});
  }

}
