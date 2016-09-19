import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {ControlConstructService, ControlConstruct} from './controlconstruct.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {RevisionComponent} from '../revision/revision.component';

@Component({
  selector: 'qddt-controle-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  pipes: [LocalDatePipe],
  providers: [ControlConstructService],
  directives: [ CommentListComponent, RevisionComponent]
})

export class ControlConstructDetailComponent {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter();
  private revisionIsVisible: boolean;

  constructor() {
    this.revisionIsVisible = false;
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
