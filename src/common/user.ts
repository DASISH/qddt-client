import {Component, EventEmitter, Output, Inject} from 'angular2/core';

import {LoginComponent} from '../components/login/login';
import {UserService} from './userservice';

@Component({
  selector: 'user-login',
  directives: [LoginComponent],
  template: `
      <div class="container z-depth-1" style="margin-top:0px;width:100%;padding:10%;">
        <div *ngIf="user">


        <div class="row red-text text-lighten-2">
          <div class="col s4"><i class="material-icons left medium">account_circle</i></div>
          <div class="col s4">
            {{user.username}}
            <br />
            {{user.email}}</div>
          </div>
          <button class="btn" value="logout" (click)="logout()"><i class="material-icons right">exit_to_app</i>Logout</button>
        </div>

        <div *ngIf="!user">
          <span class="black-text">
            <login (loginEvent)="loginEvent()"></login>
          </span>
        </div>

      </div>
  `,
  properties: ['user']
})
export class UserLogin {

  @Output('logoutEvent') logoutEvent: EventEmitter<string> = new EventEmitter();
  user: string;
  private userService: UserService;

  constructor(@Inject(UserService)userService: UserService) {
    this.userService = userService;
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }

  logout() {
    this.user = null;
    this.logoutEvent.emit('');
  }
}
