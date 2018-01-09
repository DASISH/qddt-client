import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { SequenceService, Sequence } from './sequence.service';

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequence.detail.component.html',
  providers: [ SequenceService ],
})

export class SequenceDetailComponent implements OnInit {
  @Input() sequence: Sequence;
  @Input() sequences: Sequence[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  sequenceActions = new EventEmitter<any>();
  private revisionIsVisible: boolean;
  private savedObject: string;
  private savedSequencesIndex: number;

  constructor(private service: SequenceService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    if (this.sequences === null || this.sequences === undefined) {
      this.sequences = [];
    }
    this.savedObject = JSON.stringify(this.sequence);
    this.savedSequencesIndex = this.sequences
      .findIndex(q => q['id'] === this.sequence['id']);
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onUpdateSequence() {
    this.service.update(this.sequence).subscribe((result: any) => {
      const index = this.sequences.findIndex((e: any) => e.id === result.id);
      if (index >= 0) {
        this.sequences[index] = result;
      } else if (this.savedSequencesIndex >= 0) {
        this.sequences[this.savedSequencesIndex] = JSON.parse(this.savedObject);
        this.sequences.push(result);
      }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }

  onGetElement(element: any) {
    this.sequence.children.push(element);
  }
}
