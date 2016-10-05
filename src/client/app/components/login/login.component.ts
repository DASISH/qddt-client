import { Component, Output, EventEmitter, Inject, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { API_BASE_HREF } from '../../api';
import { UserService } from '../../common/user.service';

export class LoginForm {
    public username: string;
    public password: string;
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  @Output() loginEvent: EventEmitter<string>  = new EventEmitter<string>();
  user: any;
  loginForm: LoginForm;

  static logError(err: any) {
    console.log('LoginComponent: ', err.toString());
  }

  static saveJwt(jwt: string) {
    if(jwt) {
      localStorage.setItem('jwt', JSON.stringify(jwt));
    }
  }

  constructor(@Inject(UserService) private userService: UserService,
              @Inject(Http)private http:Http, @Inject(API_BASE_HREF) private api: string) {
    this.userService = userService;
    this.http = http;
    this.loginForm = new LoginForm();//'admin@example.org', 'password');
  }

  ngOnInit() {
    this.loginForm.username = 'admin@example.org';
    this.loginForm.password = 'password';
  }

  login() {
    var headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa('client:password'));
    console.log(this.loginForm);
    this.http.post(this.api+'oauth/token' +
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

  onChangeUsername(e: string) {
    this.loginForm.username = e;
  }

  onChangePassword(e: string) {
    this.loginForm.password = e;
  }

  createUser() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.http.get(this.api+'user',
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
