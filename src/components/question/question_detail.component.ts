import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {QuestionService, QuestionItem, Question} from './question.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {QuestionItemEdit} from './question_edit.component';
import {RevisionComponent} from '../revision/revision.component';
import {PreviewComponent} from '../responsedomain/responsedomain.preview.component';
import {Change} from '../../common/change_status';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {TreeNodeComponent} from '../concept/tree-node.component';
@Component({
  selector: 'qddt-questionitem-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  pipes: [LocalDatePipe],
  providers: [QuestionService],
  directives: [ TreeNodeComponent, MaterializeDirective,
    CommentListComponent, RevisionComponent, PreviewComponent, QuestionItemEdit]
})

export class QuestionDetail {
  @Input() questionitem: QuestionItem;
  @Input() questionitems: QuestionItem[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter();
  @Output() editQuestionItem: EventEmitter<any> = new EventEmitter();
  private revisionIsVisible: boolean;
  private editIsVisible: boolean;
  private conceptIsVisible: boolean;
  private concepts: any[];

  constructor(private service: QuestionService) {
    this.revisionIsVisible = false;
    this.editIsVisible = false;
    this.conceptIsVisible = false;
    this.concepts = [];
  }

  ngOnInit() {
    if(this.questionitem.question === null) {
      this.questionitem.question = new Question();
    }
    this.service.getConceptsByQuestionitemId(this.questionitem.id)
    .subscribe(
      result => { this.concepts = result; },
      error => {console.log(error);});
  }

  hidDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onRemoveResponsedomain(questionitem: QuestionItem) {
    if (questionitem.responseDomain === undefined
      || questionitem.responseDomain.id === ''
      || questionitem.responseDomain.name === undefined) {
      return;
    }
    this.editIsVisible = false;
    questionitem.changeKind = Change.status[0][0];
    questionitem['changeComment'] = 'remove response domain ' + questionitem.responseDomain.name;
    questionitem.responseDomain = null;
    this.service.updateQuestionItem(questionitem)
      .subscribe(result => {
        this.questionitem = result;
        this.editIsVisible = true;
      });
  }

  onEditQuestionItem(questionitem: QuestionItem) {
    let i = this.questionitems.findIndex(q => q['id'] === questionitem['id']);
    this.questionitems[i] = questionitem;
  }

}
