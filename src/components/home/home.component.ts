import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginComponent} from '../login/login.component';
import {UserService} from '../../common/user.service';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram.component';
import {CommitListComponent} from '../github/commit_list.component';
import {StudyComponent} from '../study/study.component';
import {TopicComponent} from '../topic/topic.component';

@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    LoginComponent,
    SurveyProgramComponent,
    CommitListComponent,
    StudyComponent,
    TopicComponent
  ]
})
export class HomeCmp {

  surveyProgram: any;
  study:any;
  topic: any;
  showSurveyProgram: boolean = true;
  user: string;

  constructor(private userService: UserService) {

  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

  surveyCreateEvent(surveyProgram: any) {
    this.surveyProgram = surveyProgram;
  }

  selectedStudy(study: any) {
    this.study = study;
    this.showSurveyProgram = !this.showSurveyProgram;
  }

  selectedTopic(topic: any) {
    this.topic = topic;
  }
}
