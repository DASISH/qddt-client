import { Injectable, Inject, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { API_BASE_HREF } from '../api';

/**
 * AuthService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in sessionStorage.
 */
@Injectable()
export class AuthService {

  public static readonly SIGNUP_URL = 'api/auth/signup';
  public static readonly SIGNIN_URL = 'api/auth/signin';
  public static readonly REFRESH_TOKEN_URL = 'api/auth/token/refresh';
  public static readonly CHECK_URL = 'api/check/';


  @Output() loginEvent: EventEmitter<string>  = new EventEmitter<string>();

  private token: string;
  private username: string;
  private userId: string;
  private role: any;
  private email: string;
  private globalObjects: any;

  constructor(private http: Http,  @Inject(API_BASE_HREF) private api: string) {
    this.refreshUserData();
    this.globalObjects = {};
  }

  get() : any {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch(e) {
      return null;
    }
  }

  set(user: string)  {
    localStorage.setItem('user', user);
    this.saveUserDetails(JSON.parse(user));
    localStorage.setItem('jwt',this.token);
  }

  remove() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  }

  setGlobalObject(name: string, value: any) {
    this.globalObjects[name] = value;
  }

  getGlobalObject(name: string) {
    return this.globalObjects[name] || '';
  }


  /**
   * Refreshes userId, username and token from localStorage
   */
  public refreshUserData(): void {
    const user = this.get();
    if (user) {
      this.saveUserDetails(user);
    }
  }

  /**
   * Registers new user and saves following token
   * @param username
   * @param email
   * @param password
   */
  public signUp(username: string, email: string, password: string): Observable<any> {

    const requestParam = {
      email: email,
      username: username,
      password: password
    };

    return this.http.post( this.api + AuthService.SIGNUP_URL, requestParam, this.generateOptions())
      .map((res: Response) => {
        this.saveToken(res);
        this.saveUserDetails(JSON.parse(localStorage.getItem('user')));
      }).catch(err => {
        throw Error(err.json().message);
      });
  }

  /**
   * Fetches and saves token for given user
   * @param username
   * @param password
   */
  public signIn(username: string, password: string): Observable<any> {

    const requestParam = {
      username: username,
      password: password
    };

    return this.http.post(this.api + AuthService.SIGNIN_URL, requestParam) //, this.generateOptions())
      .map((res: Response) => {
        this.saveToken(res);
        this.saveUserDetails(JSON.parse(localStorage.getItem('user')));
        this.loginEvent.emit('logged_in');
      }).catch(err => {
        throw Error(err.json().message);
      });
  }

  /**
   * Removes token and user details from localStorage and service's variables
   */
  public logout(): void {
    localStorage.removeItem('user');
    this.token = null;
    this.username = null;
    this.userId = null;
    this.email = null;
    this.role = null;
  }

  /**
   * Refreshes token for the user with given token
   * @param token - which should be refreshed
   */
  public refreshToken(token: string): Observable<any> {
    const requestParam = { token: this.token };

    return this.http.post(this.api + AuthService.REFRESH_TOKEN_URL, requestParam, this.generateOptions())
      .map((res: Response) => {
        this.saveToken(res);
      }).catch(err => {
        throw Error(err.json().message);
      });
  }

  public checkPath(url: string) {
    return this.isAuthorized();
    // return this.http.get(this.api + AuthService.CHECK_URL + url,  this.generateOptions())
    //   .map((res: Response) => {
    //     return res;
    //   }).catch(err => {
    //     throw Error(err.json().message);
    //   });
  }

  /**
   * Checks if user is authorized
   * @return true is user authorized (there is token in localStorage) else false
   */
  public isAuthorized(): boolean {
    return Boolean(this.token);
  }

  /**
   * @return username if exists
   */
  public getUsername(): string {
    return this.username;
  }

  /**
   * @return userId if exists
   */
  public getUserId(): string {
    return this.userId;
  }

  /**
   * @return token if exists
   */
  public getToken(): string {
    return this.token;
  }

  public  getEmail(): string {
    return this.email;
  }

  public  getRoles(): string[] {
    return this.role;
  }

  // Saves user details with token into localStorage as user item
  private saveToken(res: Response): void {
    const response = res.json() && res.json().token;
    if (response) {
      const token = response;
      let claims = this.getTokenClaims(token);
      claims.token = token;
      localStorage.setItem('user', JSON.stringify(claims));
    } else {
      throw Error(res.json());
    }
  }

  // Saves user details into service properties
  private saveUserDetails(user): void {
    this.token = user.token || '';
    this.username = user.sub || '';
    this.userId = user.id || '';
    this.role = user.role || {};
    this.email = user.email || '';
  }

  // Retrieves user details from token
  private getTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  // Generates Headers
  private generateOptions(): RequestOptions {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    //headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
    return new RequestOptions({ headers: headers });
  }


// .map((res:Response) => res.json())
// .subscribe(
// (data: any) => LoginComponent.saveJwt(data),
// (err: any)  => LoginComponent.logError('Unable to log in user.'),
// ()          => this.createUser()


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
//     );
// }
//
// createSession(user: any) {
//   this.user = user;
//   this.userService.set(user);
//   localStorage.setItem('user', JSON.stringify(user));
//   this.loginEvent.emit('logged_in');
// }



}
