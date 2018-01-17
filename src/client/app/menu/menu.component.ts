import { Component, AfterContentChecked, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

declare var $: any;

@Component({
  selector: 'qddt-menu',
  moduleId: module.id,
  providers: [AuthService],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements AfterContentChecked, OnInit, AfterViewInit {

  showSurveyProgram = true;

  components: any = [];
  private survey: any;
  private study: any;
  private topic: any;
  private concept: any;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // this.loadData();
  }

  ngAfterContentChecked() {
    // this.loadData();
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
    this.study = this.topic = this.concept = null;
  }

  onStudy() {
    this.topic = this.concept = null;
  }

  onTopic() {
    this.topic = this.concept = null;
  }



}

