import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {ControlConstructService, ControlConstruct} from './controlconstruct.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {RevisionComponent} from '../revision/revision.component';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {PreviewComponent} from '../responsedomain/responsedomain.preview.component';

@Component({
  selector: 'qddt-controle-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  pipes: [LocalDatePipe],
  providers: [ControlConstructService],
  directives: [ CommentListComponent, RevisionComponent
  , MaterializeDirective, PreviewComponent]
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

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }
}
