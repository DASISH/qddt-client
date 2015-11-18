import {Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, Output, EventEmitter, Inject} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';

import {UserService} from '../../common/userservice';

export class LoginForm {
  public username: string = 'admin@example.org';
  public password: string = 'password';
}

@Component({
  selector: 'login',
  events: ['loginEvent'],
  viewProviders: [HTTP_PROVIDERS]
})
@View({
  templateUrl: './components/login/login.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class LoginComponent {

  @Output() loginEvent: EventEmitter  = new EventEmitter();
  user: string;
  loginForm: LoginForm;
  private userService: UserService;
  private http: Http;

  constructor(@Inject(UserService)userService: UserService, http: Http) {
    this.userService = userService;
    this.http = http;
    this.loginForm = new LoginForm();
  }

  login() {
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('client:password'));

    this.http.post('http://localhost:8080/oauth/token' +
        '?username='+ this.loginForm.username +
        '&password='+ this.loginForm.password +
        '&scope=write' +
        '&grant_type=password' +
        '&client_secret=password' +
        '&client=client',
      null
      ,
      {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(
        data  => this.saveJwt(data),
        err   => this.logError(err),
        ()    => this.createUser()
    );
  }

  saveJwt(jwt: any) {
    if(jwt) {
      localStorage.setItem('jwt', JSON.stringify(jwt));
    }
  }

  createUser() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.http.get('http://localhost:8080/user',
      {
        headers: headers
      })
      .map(res => res.json()).subscribe(
      user  => this.createSession(user),
      err   => this.logError(err)

    );
  }

  createSession(user: string) {
    this.user = user;
    this.userService.set(user);
    localStorage.setItem('user', JSON.stringify(user));

    this.loginEvent.next('event');
  }

  logError(err: string) {
    console.log('Error: ', err);
  }

  get diagnostic() { return JSON.stringify(this.loginForm); }
}
