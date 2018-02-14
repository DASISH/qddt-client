import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SequenceService, Sequence } from './sequence.service';
import { ElementKind } from '../preview/preview.service';
const saveAs = require('file-saver');

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequence.detail.component.html',
})

export class SequenceDetailComponent implements OnInit {
  @Input() sequences: Sequence[];
  @Input() sequence: Sequence;
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();

  private readonly revisionKind = ElementKind.SEQUENCE_CONSTRUCT;
  private revisionIsVisible: boolean;
  private previewObject: any;

  constructor(private service: SequenceService) {
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

  sequenceSavedEvent(sequence: Sequence) {
    if (sequence !== null) {
      let sequences = this.sequences.filter((q) => q.id !== sequence.id);
      sequences.push(sequence);
      this.sequences = sequences;
    }
  }

  onShowRevision(element: any) {
    this.previewObject = element;
  }

  getPdf(element: Sequence) {
    const fileName = element.name + '.pdf';
    this.service.getPdf(element.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
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
