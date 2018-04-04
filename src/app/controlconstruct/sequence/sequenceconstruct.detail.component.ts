import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ElementKind } from '../../shared/elementinterfaces/elements';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';
import { Action, IDetailAction } from '../../shared/elementinterfaces/detailaction';
import { ActivatedRoute, Router } from '@angular/router';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.detail.component.html',
})

export class SequenceDetailComponent implements OnInit {
  @Input() sequence: SequenceConstruct;
  // @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();

  private readonly revisionKind = ElementKind.SEQUENCE_CONSTRUCT;
  private revisionIsVisible: boolean;
  private action: IDetailAction;

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    this.action = { id: '', action: Action.None, object: null };
    this.service.getControlConstruct<SequenceConstruct>(
      this.route.snapshot.paramMap.get('id'))
      .then(ctrl => {
        this.action.id = ctrl.id;
        this.sequence = ctrl; })
      .catch( error => { throw error; } );
  }

  hideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
  }

  sequenceSavedEvent(sequence: SequenceConstruct) {
    this.hideDetail();
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
      () => {  }
    );
    this.hideDetail();
  }

}
