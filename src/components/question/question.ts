import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {Question,QuestionService} from './questionservice';
import {QuestionList} from './question_list';
import {QuestionDetail} from './question_detail';
import {UserService} from '../../common/userservice';
import {LoginComponent} from '../login/login';

@Component({
  selector: 'question',
  templateUrl: './components/question/question.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    QuestionList,
    QuestionDetail
  ],
  providers:[QuestionService]
})

export class QuestionComp {

  public selectedQuestion:any;

  //private showQuestionDetail;
  //private questionService;
  private questions;
  private user:any;

  constructor(private questionService: QuestionService,private userService: UserService) {

    this.questions = this.questionService.getModel();
    this.selectedQuestion = new Question();
  }
  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

  questionSelectEvent(question:any) {
    this.selectedQuestion = question;
    console.log('selectedEvent -> ' + question.name);
  }
}
