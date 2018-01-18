import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { SurveyProgram } from '../home/survey/survey.service';
import { Study } from '../home/study/study.service';
import { Topic } from '../home/topic/topic.service';
import { Concept } from '../home/concept/concept.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PropertyStoreService, HIERARCHY_POSITION } from '../core/global/property.service';

declare var $: any;

@Component({
  selector: 'qddt-menu',
  moduleId: module.id,
  providers: [],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription:Subscription;
  private path = [4];

  constructor(private auth: UserService, private property: PropertyStoreService,
              private router: Router,) {}

  ngOnInit() {
    this.subscription = this.property.currentChange$.subscribe(
      item => {
        this.path[item]= this.property.getCurrent();
        console.debug('currentChange ' + item);
      }
    ,(error:any) => console.error(error.toString()));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngAfterViewInit() {
    $('.button-collapse').sideNav({
      menuWidth: 100, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true});
    $('.dropdown-button').dropdown();
    // $('.collapsible').collapsible();
  }

  getEmail() : string {
    if (!this.auth.isTokenExpired())
      return this.auth.getEmail();
    return '';
  }

  getUserName() : string {
    if (!this.auth.isTokenExpired())
      return this.auth.getUsername().charAt(0).toUpperCase() + this.auth.getUsername().slice(1);
    return 'NOT LOGGED IN';
  }

  isLoggedIn() : boolean {
    return !this.auth.isTokenExpired();
  }

  logoutEvent() {
    this.auth.logout();
  }

  onSurvey() {
    this.clearAll();
    this.router.navigate(['survey/']);
  }
  onStudy() {
    this.clearTopic();
    this.router.navigate(['study/',this.getSurvey().id]);
  }
  onTopic() {
    this.clearConcept();
    this.router.navigate(['topic/',this.getStudy().id]);
  }
  onConcept() {
    this.router.navigate(['concept/',this.getTopic().id]);
  }

  getSurvey(): SurveyProgram {
    return this.property.get('survey') || new SurveyProgram() ;
  }
  getStudy(): Study {
    return this.property.get('study') || new Study();
  }
  getTopic(): Topic {
    return this.property.get('topic') || new Topic();
  }
  getConcept(): Concept {
    return this.property.get('concept') || new Concept();
  }

  clearAll() {
    this.path[HIERARCHY_POSITION.Survey] = null;
    this.property.set('study',null);
    this.path[HIERARCHY_POSITION.Study] = null;
    this.clearTopic();
  }

  clearTopic() {
    this.property.set('topic',null);
    this.path[HIERARCHY_POSITION.Topic] = null;
    this.clearConcept();
  }
  clearConcept() {
    this.property.set('concept',null);
    this.path[HIERARCHY_POSITION.Concept] = null;
  }

}

