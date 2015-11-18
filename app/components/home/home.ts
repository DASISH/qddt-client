import {Component, Inject, CORE_DIRECTIVES, Input} from 'angular2/angular2';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginComponent} from '../login/login';
import {UserService} from '../../common/userservice';

@Component({
  selector: 'home',
  templateUrl: './components/home/home.html',
  styleUrls: ['./components/home/home.css'],
  directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, LoginComponent]
})
export class HomeCmp {

  @Input() userService: UserService;
  user: string;

  constructor(@Inject(UserService)userService: UserService) {
    this.userService = userService;
  }

  afterContentChecked() {
    this.user = this.userService.get();
  }

  loginEvent() {
    this.user = this.userService.get();
  }
}
