import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { QddtPropertyStoreService, HIERARCHY_POSITION } from '../core/global/property.service';
import { UserService } from '../core/user/user.service';
import {TemplateService} from '../template/template.service';


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

  constructor(private auth: UserService, private property: QddtPropertyStoreService, private router: Router,
              private service: TemplateService) {
    this.username = this.getUserName();
    this.loggedIn = !this.auth.isTokenExpired();
  }

  ngOnInit() {
    this.propertyChanged = this.property.currentChange$.subscribe(
      (item) => { this.path[item] = this.property.getCurrent(); },
      (error) => console.error(error.toString()));
    this.loginChanged = this.auth.loginChanged$.subscribe(
      (item) => {
        this.username = this.getUserName();
        this.loggedIn = !this.auth.isTokenExpired(); },
      (error) => console.error(error.toString())
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
    console.log('token expired (no gravitar for you)');
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
    this.router.navigate(['/register']);
  }

  doResetPassword() {
    this.router.navigate(['/resetpassword']);
  }

  onCheckUrl(event) {
    const parts = event.srcElement.value.toString().split('/');
    if (parts[parts.length - 1].length !== 36) { return; } // must be a valid UUID....
    let url;
    if (parts.length === 1) {
      url =  parts[0];
    } else if (parts.length >= 2) {
      url = parts[parts.length - 2] + '/' + parts[parts.length - 1];
    }

    if (event.inputType === 'insertFromPaste' && (parts.length >= 2)) {
        this.router.navigate([url]);
        event.srcElement.value = '';
    } else {
      event.srcElement.value = '';
      this.gotoUUID(url);
    }
  }
  onSurvey() {
    this.clearAll();
    this.router.navigate(['/survey']);
  }
  onStudy() {
    this.clearTopic();
    this.router.navigate(['/study']);
  }
  onTopic() {
    this.clearConcept();
    this.router.navigate(['/topic']);
  }
  onConcept() {
    this.router.navigate(['/concept']);
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

  private gotoUUID(uuid: string) {
    this.service.searchByUuid(uuid).then( (result) => {
      this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }
}

