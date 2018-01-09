import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { API_BASE_HREF } from '../api';

export const TOKEN_NAME = 'jwt_token';
/**
 * AuthService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in localStorage.
 */
@Injectable()
export class AuthService {

  public static readonly SIGNUP_URL = 'api/auth/signup';
  public static readonly SIGNIN_URL = 'api/auth/signin';
  private static readonly USERINFO = 'user';

  private user: any;
  private globalObjects = {};

  constructor(private http: HttpClient,  @Inject(API_BASE_HREF) private api: string) {
    this.refreshUserData();
  }

  public refreshUserData(): void {
    this.user = JSON.parse(localStorage.getItem(AuthService.USERINFO));
  }

  public signIn(username: string, password: string): Observable<any> {

    const requestParam = {
      username: username,
      password: password
    };

    return this.http.post<any>(this.api + AuthService.SIGNIN_URL, requestParam)
      .map(response => {
        console.info('JSON -> ' + JSON.stringify(response));
        if (response && response.token) {
          this.setUserData(response);
        }
        return response;
      })
      .catch(err => {
        throw Error(err.json().message);
      });
  }

  /**
   * Removes token and user details from localStorage and service's variables
   */
  public logout(): void {
    localStorage.removeItem(TOKEN_NAME);
    // localStorage.removeItem(AuthService.USERINFO); NOPE!
  }

  setGlobalObject(name: string, value: any) {
    this.globalObjects[name] = value;
  }

  getGlobalObject(name: string) {
    return this.globalObjects[name] || '';
  }

  public isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  public getUsername(): string {
    return this.user.username;
  }

  public getUserId(): string {
    return this.user.userId;
  }

  public  getEmail(): string {
    return this.user.email;
  }

  public  getRoles(): string[] {
    return this.user.role;
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  private setUserData(userjson: any ): void {
    const response = userjson && userjson.token;
    if (response) {
      const token = response;
      let claims = this.getTokenClaims(token);
      claims.token = token;
      localStorage.setItem(AuthService.USERINFO, JSON.stringify(claims));
      this.setToken(token);
      this.refreshUserData();
    } else {
      throw Error(userjson);
    }
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded = this.getTokenClaims(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }



  // Retrieves user details from token
  private getTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
