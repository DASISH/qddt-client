import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SequenceService, Sequence } from './sequence.service';

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequence.detail.component.html',
  providers: [ SequenceService ],
})

export class SequenceDetailComponent {
  @Input() sequence: Sequence;
  @Input() sequences: Sequence[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  sequenceActions = new EventEmitter<any>();
  private revisionIsVisible: boolean;

  constructor(private service: SequenceService) {
    this.revisionIsVisible = false;
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onUpdateSequence() {
    this.service.update(this.sequence).subscribe((result: any) => {
        let index = this.sequences.findIndex((e:any) => e.id === result.id);
        if(index >= 0) {
          this.sequence[index] = result;
        }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }
}
