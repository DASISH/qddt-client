import {Component, ViewEncapsulation, Inject} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {Router} from 'angular2/router';

// import {HTTP_BINDINGS} from 'http/http';

import {HomeCmp} from '../home/home';
import {UserLogin} from '../../common/user';
import {UserService} from '../../common/userservice';

@Component({
  selector: 'app',
  templateUrl: './components/app/app.html',
  styleUrls: ['./components/app/app.css'],
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, UserLogin]
})
@RouteConfig([
  { path: '/', component: HomeCmp, as: 'Home' },
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

  afterContentChecked() {
    this.user = this.userService.get();
  }

  logoutEvent() {
    this.userService.remove();
    this.router.navigate(['/Home']);
  }
}
