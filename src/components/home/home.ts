import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {CommitListComponent} from '../github/commit_list';
import {LoginComponent} from '../login/login';
import {UserService} from '../../common/userservice';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram';
import {StudyComponent} from '../study/study';
import {TopicComponent} from '../topic/topic';

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
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
  topic:any;

  showTopic:boolean = false;
  showSurveyProgram: boolean = true;
  showStudy:boolean = false;
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
    console.log('surveyCreateEvent()');
    this.surveyProgram = surveyProgram;
  }

  selectedStudy(study: any) {
    console.log('selectedStudy('+study.name +')');
    this.study = study;
    this.showSurveyProgram = !this.showSurveyProgram;
    this.showTopic = false;
  }

  selectedTopic(topic: any) {
    console.log('selectedTopic()');
    this.topic = topic;
    this.showStudy = !this.showStudy;
    this.showTopic = true;
  }
}
