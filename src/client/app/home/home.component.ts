import { Component, AfterContentChecked, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'qddt-home',
  moduleId: module.id,
  providers: [AuthService],
  templateUrl: './home.component.html',
})

export class HomeComponent implements AfterContentChecked, OnInit {

  showSurveyProgram: boolean = true;
  showStudy: boolean = false;
  showTopic: boolean = false;
  showConcept: boolean = false;

  components: any = [];
  user:any;
  private survey: any;
  private study: any;
  private topic: any;
  private concept: any;

  constructor(private userService: AuthService) {

  }

  ngOnInit() {
    this.loadData();
  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
    this.loadData();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

  onShowSurvey() {
    this.showStudy = false;
    this.showConcept = false;
    this.showTopic = false;
    this.showSurveyProgram = true;

    this.study = null;
    this.topic = null;
    this.concept = null;
    this.saveGlobalConfig('survey');
  }

  onShowStudy() {
    this.showTopic = false;
    this.showConcept = false;
    this.showSurveyProgram = false;
    this.showStudy = true;

    this.topic = null;
    this.concept = null;
    this.saveGlobalConfig('study');
  }

  onShowTopic() {
    this.showConcept = false;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = true;
    this.showConcept = false;

    this.concept = null;
    this.saveGlobalConfig('topic');
  }

  onShowConcept() {
    this.concept = null;
    this.showSurveyProgram = false;
    this.showStudy = false;
    this.showTopic = false;
    this.showConcept = true;
    this.saveGlobalConfig('concept');
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

  private saveGlobalConfig(name: string) {
    this.userService.setGlobalObject('home', {
      'current': name,
      'survey': this.survey, 'study': this.study,
      'topic': this.topic, 'concept': this.concept,
    });
  }

  private loadData() {
    let home = this.userService.getGlobalObject('home');
    if (home !== null && home !== '') {
      this.showStudy = home.current === 'study';
      this.showConcept = home.current === 'concept';
      this.showTopic = home.current === 'topic';
      this.showSurveyProgram = home.current === 'survey';
      this.survey = home.survey;
      this.study = home.study;
      this.topic = home.topic;
      this.concept = home.concept;
    }
  }
}
