import { Component, ViewEncapsulation, Inject, AfterContentChecked } from '@angular/core';

import { UserService } from '../../common/user.service';

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ UserService ]
})

export class AppCmp implements AfterContentChecked {

  public user: string;
  private userService: UserService;

  constructor(@Inject(UserService)userService: UserService) {
    this.userService = userService;
    this.user = this.userService.get();
  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  logoutEvent() {
    this.userService.remove();
  }

  onInstruments() {
    this.userService.setGlobalObject('current', 'instrument');
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

  private checkRouter(target: string, value: string) {
    let current = this.userService.getGlobalObject('current');
    if (current === target) {
      let config = this.userService.getGlobalObject('home');
      if(config.current !== value) {
        this.userService.setGlobalObject(target, {'current': value});
      }
    } else if(this.userService.getGlobalObject(target) === '') {
      this.userService.setGlobalObject(target, {'current': value});
    }
    this.userService.setGlobalObject('current', target);
  }
}
