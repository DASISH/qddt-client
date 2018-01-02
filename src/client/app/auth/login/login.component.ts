import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
// import { Http, Headers, Response } from '@angular/http';
// import 'rxjs/add/operator/map';
// import { API_BASE_HREF } from '../../api';
// import { UserService } from '../user/user.service';
// import { concat } from 'rxjs/observable/concat';



export class LoginForm {
  username: string;
  password: string;
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  providers: [AuthService]
})
export class LoginComponent {

  @Output() loginEvent: EventEmitter<string>  = new EventEmitter<string>();
  user: any;
  loginData: LoginForm;

  constructor(private loginService: AuthService) {
    this.loginData = new LoginForm();
    this.loginData.username = 'review@example.org';
    this.loginData.password = 'password';
  }

  login() {
    console.log('loggin ...');
    this.loginService.signIn(this.loginData.username,this.loginData.password)
    .subscribe( ()=> {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.loginEvent.emit('logged_in');
    });
  }
  // static logError(err: any) {
  //   console.log('LoginComponent: ', err.toString());
  // }

  // static saveJwt(jwt: string) {
  //   if(jwt) {
  //     localStorage.setItem('jwt', JSON.stringify(jwt));
  //   }
  // }

  // constructor(@Inject(UserService) private userService: UserService,
  //             @Inject(Http)private http:Http, @Inject(API_BASE_HREF) private api: string) {
  //   this.userService = userService;
  //   this.http = http;
  //   this.loginData = new LoginForm();
  //   this.loginData.username = 'admin@example.org';
  //   this.loginData.password = 'password';
  // }

  // login() {
  //   var headers = new Headers();
  //   headers.append('Authorization', 'Basic ' + btoa('client:password'));
  //   this.http.post(this.api+'api/auth/signin' +
  //       '?username='+ this.loginData.username +
  //       '&password='+ this.loginData.password +
  //       '&scope=write' +
  //       '&grant_type=password' +
  //       '&client_secret=40201ad8-2f46-4bfb-9ad9-800c12671549d50868b8-50ec-4ca9-bf09-aad731c823e0' +
  //       '&client=client',
  //     null
  //     ,
  //     {
  //       headers: headers
  //     })
  //     .map((res:Response) => res.json())
  //     .subscribe(
  //       (data: any) => LoginComponent.saveJwt(data),
  //       (err: any)  => LoginComponent.logError('Unable to log in user.'),
  //       ()          => this.createUser()
  //   );
  // }

  // createUser() {
  //   var headers = new Headers();
  //   headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
  //   this.http.get(this.api+'user',
  //     {
  //       headers: headers
  //     })
  //     .map((res:Response) => res.json())
  //     .subscribe(
  //       (user: any)  => this.createSession(user),
  //       (err: any)   => LoginComponent.logError('Unable to create user.')
  //   );
  // }

  // createSession(user: any) {
  //   this.user = user;
  //   this.userService.set(user);
  //   localStorage.setItem('user', JSON.stringify(user));
  //   this.loginEvent.emit('logged_in');
  // }

  //get diagnostic() { return JSON.stringify(this.loginData); }
}
