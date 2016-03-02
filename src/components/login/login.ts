import {Component, Output, EventEmitter, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import 'rxjs/add/operator/map';

import {UserService} from '../../common/userservice';

export class LoginForm {
  public username: string = 'admin@example.org';
  public password: string = 'password';
}

@Component({
  selector: 'login',
  templateUrl: './components/login/login.html'
})
export class LoginComponent {

  @Output() loginEvent: EventEmitter<string>  = new EventEmitter();
  user: any;
  loginForm: LoginForm;

  constructor(@Inject(UserService) private userService: UserService,
              @Inject(Http)private http:Http) {
    this.userService = userService;
    this.http = http;
    this.loginForm = new LoginForm();
  }

  static logError(err: any) {
    console.log('LoginComponent: ', err.toString());
  }

  static saveJwt(jwt: string) {
    if(jwt) {
      localStorage.setItem('jwt', JSON.stringify(jwt));
    }
  }

  login() {
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('client:password'));

    this.http.post('http://nsd349.nsd.lan:8080/oauth/token' +
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
      .map((res:Response) => res.json())
      .subscribe(
        (data: any) => LoginComponent.saveJwt(data),
        (err: any)  => LoginComponent.logError('Unable to log in user.'),
        ()          => this.createUser()
    );
  }

  createUser() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.http.get('http://nsd349.nsd.lan:8080/user',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (user: any)  => this.createSession(user),
        (err: any)   => LoginComponent.logError('Unable to create user.')
    );
  }

  createSession(user: any) {
    this.user = user;
    this.userService.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    this.loginEvent.emit('logged_in');
  }

  get diagnostic() { return JSON.stringify(this.loginForm); }
}
