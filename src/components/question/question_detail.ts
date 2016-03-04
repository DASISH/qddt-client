import {Component, Input} from 'angular2/core';
import {Question,QuestionService} from './questionservice';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-detail',
  providers: [QuestionService],
  pipes: [LocalDatePipe],
  directives: [MaterializeDirective],
  templateUrl: './components/question/question_detail.html'
})

export class QuestionDetail {

  @Input() question: Question;
  private changeReasons: any;

  constructor(private service: QuestionService) {
    this.service = service;
    this.changeReasons = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
  }

  saveQuestion() {
    this.service.save(this.question).subscribe(result => this.question = result, log => console.log(log));
  }

}
