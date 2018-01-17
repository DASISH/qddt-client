import { Component, ViewEncapsulation  } from '@angular/core';
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

export class AppComponent  {

  constructor(public userService: AuthService) {
    //
  }

  isLoggedIn() : boolean {
    return !this.userService.isTokenExpired();
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
