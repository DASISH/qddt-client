import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';



import {LoginComponent} from '../login/login';
import {UserService} from '../../common/userservice';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram';
import {CommitListComponent} from '../github/commit_list';
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
