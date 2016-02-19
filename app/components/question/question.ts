import {ROUTER_DIRECTIVES} from "angular2/router";
import {LoginComponent} from "../login/login";
import {SurveyProgramComponent} from "../surveyprogram/surveyprogram";

import {Component} from "angular2/core";
import {HomeCmp} from "../home/home";
import {UserService} from "../../common/userservice";
import {Question,QuestionService} from "./questionservice";

@Component({
  selector: 'question',
  templateUrl: './components/question/question.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent
  ]
})

export class QuestionComp {

  user: string;
  questions: Array<Question> = [];

  constructor(private userService: UserService, private questionService: QuestionService) {

    this.questions = this.questionService.getModel();
  }


  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }
}
