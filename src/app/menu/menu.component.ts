import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { PropertyStoreService, HIERARCHY_POSITION } from '../core/global/property.service';
import { UserService } from '../core/user/user.service';


declare var $: any;

@Component({
  selector: 'qddt-menu',
  moduleId: module.id,
  providers: [],
  styleUrls: ['./menu.component.css'],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {
  public propertyChanged: Subscription;
  public loginChanged: Subscription;
  public path = [4];
  public username;
  public loggedIn: boolean;

  constructor(private auth: UserService, private property: PropertyStoreService,
              private router: Router, ) {
    this.username = this.getUserName();
    this.loggedIn = !this.auth.isTokenExpired();
  }

  ngOnInit() {
    this.propertyChanged = this.property.currentChange$.subscribe(
      item => {
        this.path[item] = this.property.getCurrent();
      }
    , (error: any) => console.error(error.toString()));
    this.loginChanged = this.auth.loginChanged$.subscribe(
      item => {
        this.username = this.getUserName();
        this.loggedIn = !this.auth.isTokenExpired();
      }
      , (error: any) => console.error(error.toString())
    );
  }

  ngOnDestroy(): void {
    this.propertyChanged.unsubscribe();
    this.loginChanged.unsubscribe();
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

  getEmail(): string {
    if (!this.auth.isTokenExpired()) {
      return this.auth.getEmail();
    }
    console.log('gravitar token expired');
    return '';
  }

  getUserName(): string {
    if (!this.auth.isTokenExpired()) {
      return this.auth.getUsername().charAt(0).toUpperCase() + this.auth.getUsername().slice(1);
    }
    return 'NOT LOGGED IN';
  }

  logoutEvent() {
    this.auth.logout();
  }

  doRegister() {
    this.router.navigate(['register']);
  }

  doResetPassword() {
    // TODO implement ResetPassword
  }

  onSurvey() {
    this.clearAll();
    this.router.navigate(['survey']);
  }
  onStudy() {
    this.clearTopic();
    this.router.navigate(['study']);
  }
  onTopic() {
    this.clearConcept();
    this.router.navigate(['topic']);
  }
  onConcept() {
    this.router.navigate(['concept']);
  }

  clearAll() {
    this.path[HIERARCHY_POSITION.Survey] = null;
    this.property.set('study', null);
    this.path[HIERARCHY_POSITION.Study] = null;
    this.clearTopic();
  }

  clearTopic() {
    this.property.set('topic', null);
    this.path[HIERARCHY_POSITION.Topic] = null;
    this.clearConcept();
  }
  clearConcept() {
    this.property.set('concept', null);
    this.path[HIERARCHY_POSITION.Concept] = null;
  }

}

