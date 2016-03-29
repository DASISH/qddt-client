import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginComponent} from '../login/login.component';
import {UserService} from '../../common/user.service';
import {SurveyProgramComponent} from '../surveyprogram/surveyprogram.component';
import {CommitListComponent} from '../github/commit_list.component';
import {StudyComponent} from '../study/study.component';
import {TopicComponent} from '../topic/topic.component';
import {ConceptComponent} from '../concept/concept.component';

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
    TopicComponent,
    ConceptComponent
  ]
})
export class HomeCmp {

  showSurveyProgram: boolean = true;
  showStudy: boolean = false;
  showTopic: boolean = false;
  showConcept: boolean = false;

  components: any = [];

  private user: string;

  private survey: any;
  private study: any;
  private topic: any;
  private concept: any;

  constructor(private userService: UserService) {

  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

   onShowSurvey() {

     this.showStudy = false;
     this.showConcept = false;
     this.showTopic = false;

     this.showSurveyProgram =true;

     this.study = null;
     this.topic = null;

  }

  onShowStudy() {
    this.showTopic = false;
    this.showConcept = false;
    this.showSurveyProgram = false;

    this.showStudy = true;

    this.topic = null;
  }

  onShowTopic() {
    this.showConcept = false;
    this.showSurveyProgram = false;
    this.showStudy = false;

    this.showTopic = true;
  }

  onShowConcept() {
    this.concept = null;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = true;
    this.showConcept = true;
  }

  onSurveySelect(surveyProgram: any) {
    this.survey = surveyProgram;
    this.onShowStudy();
  }

  onStudySelected(study: any) {
    this.study = study;
    this.onShowTopic();
    //this.showSurveyProgram = false;
    //this.showStudy = false;
    //this.showTopic = true;
  }

  onTopicSelected(topic: any) {
    this.topic = topic;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = true;
    this.showConcept = true;
  }

  onConceptSelected(concept: any) {
    this.concept = concept;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = true;
    this.showConcept = true;
  }
}
