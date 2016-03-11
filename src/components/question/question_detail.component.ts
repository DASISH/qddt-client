import {Component, Input,Output,EventEmitter} from 'angular2/core';
import {QuestionService} from './question.service';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  providers: [QuestionService],
  pipes: [LocalDatePipe],
  directives: [MaterializeDirective],
})

export class QuestionDetail {

  @Output() questionModifiedEvent:EventEmitter<String> = new EventEmitter();
  @Input() question:any;

  private changes:any;

  constructor(private service:QuestionService) {
    this.changes = [
      ['IN_DEVELOPMENT', 'Work in progress'],
      ['TYPO', 'Ortographical adjustment'],
      ['NEW_MAJOR', 'Conceptual improvement'],
      ['NEW_MAJOR', 'Real life change'],
      ['NEW_MAJOR', 'Other purpose']
    ];

  }


  onSaveQuestion() {
    this.service.save(this.question)
      .subscribe(result => {
        this.questionModifiedEvent.emit(result);
      });
  }

}
