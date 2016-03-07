import {Component, ViewEncapsulation, Inject} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeCmp} from '../home/home.component';
import {UserLogin} from '../../common/user.component';
import {UserService} from '../../common/user.service';
import {QuestionComp} from '../question/question.component';

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, UserLogin]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/question', component: QuestionComp, as: 'Questions' }
])
export class AppCmp {

  public user: string;
  private userService: UserService;
  private router: Router;

  constructor(@Inject(UserService)userService: UserService, router: Router) {
    this.userService = userService;
    this.router = router;
    this.user = this.userService.get();
  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  logoutEvent() {
    this.userService.remove();
    this.router.navigate(['/Home']);
  }
}
