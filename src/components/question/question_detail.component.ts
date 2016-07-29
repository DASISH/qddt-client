import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {QuestionService, QuestionItem, Question} from './question.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {QuestionItemEdit} from './question_edit.component';
import {RevisionComponent} from '../revision/revision.component';
import {PreviewComponent} from '../responsedomain/responsedomain.preview.component';

@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  pipes: [LocalDatePipe],
  providers: [QuestionService],
  directives: [ CommentListComponent, RevisionComponent, PreviewComponent, QuestionItemEdit]
})

export class QuestionDetail {
  @Input() questionitem: QuestionItem;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter();
  private revisionIsVisible: boolean;
  private editIsVisible: boolean;

  constructor() {
    this.revisionIsVisible = false;
    this.editIsVisible = false;
  }

  ngOnInit() {
    if(this.questionitem.question === null) {
      this.questionitem.question = new Question();
    }
  }

  hidDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
