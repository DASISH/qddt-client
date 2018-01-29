import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../../api';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './user';
import { PropertyStoreService } from '../global/property.service';

export const TOKEN_NAME = 'jwt_token';


/**
 * UserService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in localStorage.
 */
@Injectable()
export class UserService {

  public static readonly SIGNUP_URL = 'auth/signup';
  public static readonly SIGNIN_URL = 'auth/signin';
  public static readonly RESET_PWD_URL = 'auth/reset';
  private static readonly USERINFO = 'user';

  loginChanged$: Observable<string>;
  // Observable navItem source
  private _newcurrent = new BehaviorSubject<string>('');

  private user: User;


  constructor(private http: HttpClient,  @Inject(API_BASE_HREF) private api: string) {
    this.loginChanged$ = this._newcurrent.asObservable();
    this.refreshUserData();
    if (this.isTokenExpired())
      this.logout();
  }

  public refreshUserData(): void {
    this.user = JSON.parse(localStorage.getItem(UserService.USERINFO));
    if(!this.user)
     this.user = new User();
  }

  public signIn(email: string, password: string): Observable<any> {

    const requestParam = {
      email: email,
      password: password
    };

    return this.http.post<any>(this.api + UserService.SIGNIN_URL, requestParam)
      .map(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUserData(response);
        }
        return response;
      });
  }

  public registerUser(userdata:any) : Observable<any> {
    return this.http.post(this.api + UserService.SIGNUP_URL, userdata);
  }

  public resetPassword(userdata:User) : Observable<any> {
    return this.http.post(this.api + UserService.RESET_PWD_URL, userdata);
  }

  /**
   * Removes token and user details from localStorage and service's variables
   */
  public logout(): void {
    localStorage.removeItem(TOKEN_NAME);
    this._newcurrent.next('');
  }

  public isTokenExpired(): boolean {
    if (!this.getToken()) return true;

    const date = new Date(0);
    date.setUTCSeconds(this.user.exp);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  public getUsername(): string {
    return this.user.sub ||'no name';
  }

  public getUserId(): string {
    return this.user.userId;
  }

  public  getEmail(): string {
    return this.user.email;
  }

  public  getRoles(): string[] {
    return this.user.roles;
  }

  public  getAgency(): string {
    return this.user.agency;
  }

  public getToken(): string {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token === 'undefined')
      return null;
    else
      return token;
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME,token);
  }

  private setUserData(userjson: any ): void {
    const response = userjson && userjson.token;
    if (response) {
      const token = response;
      let claims = this.getTokenClaims(token);
      claims.token = userjson.token;
      localStorage.setItem(UserService.USERINFO, JSON.stringify(claims));
      this.refreshUserData();
      this._newcurrent.next(this.user.sub);
    } else {
      throw Error(userjson);
    }
  }

  // Retrieves user details from token
  private getTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
