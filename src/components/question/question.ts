import {Component} from 'angular2/core';

import {QuestionService} from './questionservice';
import {QuestionList} from './question_list';
import {QuestionDetail} from './question_detail';

@Component({
  selector: 'question',
  templateUrl: './components/question/question.html',
  directives: [QuestionList, QuestionDetail],
  providers: [QuestionService]
})

export class QuestionComp {

  private questions: any;

  constructor(private questionService: QuestionService) {
    this.questionService.getAll().subscribe(result => this.questions = result);
  }

}
