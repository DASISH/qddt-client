import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ElementKind } from '../../interfaces/elements';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';
const filesaver = require('file-saver');

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.detail.component.html',
})

export class SequenceDetailComponent implements OnInit {
  @Input() sequence: SequenceConstruct;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();

  private readonly revisionKind = ElementKind.SEQUENCE_CONSTRUCT;
  private revisionIsVisible: boolean;
  private previewObject: any;

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  sequenceSavedEvent(sequence: SequenceConstruct) {
    this.hideDetail();
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
    this.service.deleteControlConstruct(this.sequence.id).subscribe(
      () => { }
    );
    this.hideDetail();
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
