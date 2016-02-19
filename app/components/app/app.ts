import {Component, ViewEncapsulation, Inject} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {HomeCmp} from '../home/home';
import {UserLogin} from '../../common/user';
import {UserService} from '../../common/userservice';
import {QuestionComp} from "../question/question";
import {SearchComp} from "../search/search";
import {ResponsedomainComp} from "../responsedomain/responsdomain";

@Component({
  selector: 'app',
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, UserLogin]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
  { path: '/question', component: QuestionComp, as: 'Questions' },
  //{ path: '/responsedomain', component: ResponsedomainComp, as: 'Responsedomain' },
  //{ path: '/search', component: SearchComp, as: 'Search' },
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
