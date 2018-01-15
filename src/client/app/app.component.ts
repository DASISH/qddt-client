import { Component, ViewEncapsulation,  AfterViewInit  } from '@angular/core';
// import { AlertComponent} from './alert/alert.component';
import { AuthService } from './auth/auth.service';

declare var $: any;

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})

export class AppComponent implements AfterViewInit {

  constructor(public userService: AuthService) {
    //
  }

  ngAfterViewInit() {
    $('.button-collapse').sideNav({
      menuWidth: 100, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true});
    $('.dropdown-button').dropdown();
    $('.collapsible').collapsible();
  }

  getEmail() : string {
    if (!this.userService.isTokenExpired())
      return this.userService.getEmail();
    return '';
  }

  getUserName() : string {
    if (!this.userService.isTokenExpired())
        return this.userService.getUsername().charAt(0).toUpperCase() + this.userService.getUsername().slice(1);
    return 'NOT LOGGED IN';
  }
  isLoggedIn() : boolean {
    return !this.userService.isTokenExpired();
  }

  logoutEvent() {
    this.userService.logout();
  }

  onInstruments() {
    this.userService.setGlobalObject('current', 'instrument');
  }

  onSequences() {
    this.userService.setGlobalObject('current', 'sequence');
  }

  onQuestions() {
    this.checkRouter('questions', 'list');
  }

  onHome() {
    this.checkRouter('home', 'survey');
  }

  onCategories() {
    this.checkRouter('categories', 'list');
  }

  onSchemes() {
    this.checkRouter('schemes', 'list');
  }

  onResponsedomains() {
    this.checkRouter('responsedomains', 'list');
  }

  onConstructs() {
    this.checkRouter('constructs', 'list');
  }

  onPublications() {
    this.checkRouter('publications', 'list');
  }

  private checkRouter(target: string, value: string) {
    const current = this.userService.getGlobalObject('current');
    if (current === target) {
      const config = this.userService.getGlobalObject('home');
      if (config.current !== value) {
        this.userService.setGlobalObject(target, {'current': value});
      }
    } else if (this.userService.getGlobalObject(target) === '') {
      this.userService.setGlobalObject(target, {'current': value});
    }
    this.userService.setGlobalObject('current', target);

  }
}
