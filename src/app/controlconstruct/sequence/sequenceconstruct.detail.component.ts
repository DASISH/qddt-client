import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ElementKind } from '../../preview/preview.service';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';
const filesaver = require('file-saver');

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.detail.component.html',
})

export class SequenceDetailComponent implements OnInit {
  @Input() sequences: SequenceConstruct[];
  @Input() sequence: SequenceConstruct;
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();

  private readonly revisionKind = ElementKind.SEQUENCE_CONSTRUCT;
  private revisionIsVisible: boolean;
  private previewObject: any;

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    if (!this.sequences) {
      this.sequences = [];
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  sequenceSavedEvent(sequence: SequenceConstruct) {
    if (sequence !== null) {
      const sequences = this.sequences.filter((q) => q.id !== sequence.id);
      sequences.push(sequence);
      this.sequences = sequences;
    }
  }

  onShowRevision(element: any) {
    this.previewObject = element;
  }

  getPdf(element: SequenceConstruct) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  onDeleteSequence() {
    // TODO implement DeleteSequence
  }
    // this.service.(this.category.id)
    //   .subscribe(() => {
    //       const i = this.categories.findIndex(q => q['id'] === this.category.id);
    //       if (i >= 0) {
    //         this.categories.splice(i, 1);
    //         this.hideDetail();
    //       }
    //     },
    //     (error: any) => console.log(error));

  // hideDetail() {
  //   this.hideDetailEvent.emit('hide');
  // }

}
