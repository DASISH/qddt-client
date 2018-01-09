import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Sequence, SequenceService } from './sequence.service';

@Component({
  selector: 'qddt-sequence-content',
  moduleId: module.id,
  templateUrl: './sequence.content.component.html',
  styles: [
    '.control-children { padding-left: 20px }',
  ],
  providers: [ SequenceService ],
})

export class SequenceContentComponent implements OnInit {
  @Input() sequence: Sequence;
  error: any;
  selectedElement: any;
  sequenceContentActions = new EventEmitter<any>();

  constructor(private service: SequenceService) {
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
