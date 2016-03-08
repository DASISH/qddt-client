import {Component, Input} from 'angular2/core';
import {Question,QuestionService} from './question.service';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-detail',
  moduleId: module.id,
  templateUrl: './question_detail.component.html',
  //styleUrls: './question_detail.component.css',
  //styles: ['button {padding:5px; }'],
  providers: [QuestionService],
  pipes: [LocalDatePipe],
  directives: [MaterializeDirective],
})

export class QuestionDetail {

  @Input() question: Question;
  private changes:any;

  constructor(private service: QuestionService) {
    //this.service = service;
    this.changes = [
      ['IN_DEVELOPMENT','Work in progress'],
      ['TYPO','Ortographical adjustment'],
      ['NEW_MAJOR','Conceptual improvement'],
      ['NEW_MAJOR','Real life change'],
      ['NEW_MAJOR','Other purpose']
    ];
  }

  saveQuestion() {
    this.service.save(this.question).subscribe(result => this.question = result, log => console.log(log));
    console.log('saveQuestion');
  }

}
