import { Component, AfterContentChecked } from '@angular/core';

import { UserService } from '../../common/user.service';

@Component({
  selector: 'home',
  moduleId: module.id,
  templateUrl: './home.component.html',
  providers: [ UserService ]
})
export class HomeCmp implements AfterContentChecked {

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
    this.concept = null;
  }

  onShowTopic() {
    this.showConcept = false;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = true;
    this.showConcept = false;

    this.concept = null;
  }

  onShowConcept() {
    this.concept = null;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = false;
    this.showConcept = true;
  }

  onSurveySelect(surveyProgram: any) {
    this.survey = surveyProgram;
    this.onShowStudy();
  }

  onStudySelected(study: any) {
    this.study = study;
    this.onShowTopic();
  }

  onTopicSelected(topic: any) {
    this.topic = topic;
    this.onShowConcept();
  }

  onConceptSelected(concept: any) {
    this.concept = concept;
    this.showConcept = true;
  }
}
