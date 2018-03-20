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

export class SequenceContentComponent implements OnInit {
  @Input() sequence: SequenceConstruct;
  error: any;
  selectedElement: any;
  sequenceContentActions = new EventEmitter<any>();

  constructor(private service: ControlConstructService) {
  }

  ngOnInit() {
    //
  }

  onSelectedElement(element: any) {
    this.selectedElement = element;
    this.sequenceContentActions.emit({action: 'modal', params: ['open']});
  }

  popupModal(error: any) {
    this.error = error;
  }
}
