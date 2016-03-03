import {Component, Input} from 'angular2/core';
import {Question,QuestionService} from './questionservice';
import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'question-detail',
  providers: [QuestionService],
  pipes: [LocalDatePipe],
  templateUrl: './components/question/question_detail.html'
})

export class QuestionDetail {

  @Input() question: Question;
  private changeReasons: any;

  constructor(private service: QuestionService) {
    this.service = service;
    this.changeReasons = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];

  }

  ngAfterViewInit() {
    QuestionService.logError('Detail init');
  }

  saveQuestion() {
    console.log('question save');
    this.question = this.service.save(this.question);
  }
}
