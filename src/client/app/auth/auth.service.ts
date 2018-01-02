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
  private userId: number;


  constructor(private http: Http,  @Inject(API_BASE_HREF) private api: string) {
    this.refreshUserData();
  }

  /**
   * Refreshes userId, username and token from sessionStorage
   */
  public refreshUserData(): void {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.saveUserDetails(JSON.parse(user));
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
        this.saveUserDetails(JSON.parse(sessionStorage.getItem('user')));
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
        this.saveUserDetails(JSON.parse(sessionStorage.getItem('user')));
        this.loginEvent.emit('logged_in');
      }).catch(err => {
        throw Error(err.json().message);
      });
  }

  /**
   * Removes token and user details from sessionStorage and service's variables
   */
  public logout(): void {
    sessionStorage.removeItem('user');
    this.token = null;
    this.username = null;
    this.userId = null;
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

  public checkPath(url: string): Observable<any> {
    return this.http.get(this.api + AuthService.CHECK_URL + url,  this.generateOptions())
      .map((res: Response) => {
        return res;
      }).catch(err => {
        throw Error(err.json().message);
      });
  }

  /**
   * Checks if user is authorized
   * @return true is user authorized (there is token in sessionStorage) else false
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
  public getUserId(): number {
    return this.userId;
  }

  /**
   * @return token if exists
   */
  public getToken(): string {
    return this.token;
  }

  // Saves user details with token into sessionStorage as user item
  private saveToken(res: Response): void {
    const response = res.json() && res.json().token;
    if (response) {
      const token = response;
      let claims = this.getTokenClaims(token);
      claims.token = token;
      sessionStorage.setItem('user', JSON.stringify(claims));
    } else {
      throw Error(res.json());
    }
  }

  // Saves user details into service properties
  private saveUserDetails(user): void {
    this.token = user.token || '';
    this.username = user.sub || '';
    this.userId = user.id || 0;
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
