import {Component} from 'angular2/core';

import {QuestionService} from './question.service';
import {QuestionList} from './question_list.component';
import {QuestionDetail} from './question_detail.component';

@Component({
  selector: 'question',
  moduleId: module.id,
  templateUrl: './question.component.html',
  directives: [QuestionList, QuestionDetail],
  providers: [QuestionService]
})

export class QuestionComp {

  //private questions: any;

  constructor(private questionService: QuestionService) {
  }

  //
  //ngOnChanges() {
  //  console.log('ngOnChanges - fetch questions');
  //  this.questionService.getAll().subscribe(result => this.questions = result);
  //}
}
