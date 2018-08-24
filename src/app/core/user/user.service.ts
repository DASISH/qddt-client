
import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { User } from './user';
import { IAuthority, UserJson } from '../../user/user.classes';

export const TOKEN_NAME = 'jwt_token';

export class Agency  {
  id: string;
  name: string;
}

export class ResetPassword {
  id: string;
  oldPassword: string;
  password: string;

  public constructor(init?: Partial<ResetPassword>) {
    Object.assign(this, init);
  }
}

export interface IPassword {
  id: string;
  oldPassword: string;
  password: string;
  confirm?: string;
}

/**
 * UserService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in localStorage.
 */
@Injectable()
export class UserService {
  public static readonly SIGNIN_URL = 'auth/signin';
  public static readonly ANGENCY_URL = 'agency/all';
  public static readonly RESET_PWD_URL = 'user/resetpassword';
  public static readonly UPDATE_URL = 'user';
  public static readonly AUTHORITY_URL = 'authority/all';
  private static readonly USERINFO = 'user';

  loginChanged$: Observable<string>;
  // Observable navItem source
  private _newcurrent = new BehaviorSubject<string>('');

  private _user: User;


  constructor(private http: HttpClient,  @Inject(API_BASE_HREF) private api: string) {
    this.loginChanged$ = this._newcurrent.asObservable();
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  public getUser(): User {
    if (!(this._user )) {
      console.log('setting user...');
      this._user = JSON.parse(localStorage.getItem(UserService.USERINFO));
    }
    return this._user || new User();
  }

  public signIn(email: string, password: string): Observable<any> {

    const requestParam = {
      email: email,
      password: password
    };

    return this.http.post<any>(this.api + UserService.SIGNIN_URL, requestParam).pipe(
      map(response => {
        if (response && response.token) {
          this.setToken(response.token);
          this.setUserData(response);
        } else {
          console.log('login incomplete....');
        }
        return response;
      }));
  }


  public save(userdata: UserJson): Observable<any> {
    return this.http.post(this.api + UserService.UPDATE_URL, userdata);
  }

  public resetPassword(password: IPassword): Observable<any> {
    console.log((password.id));
    if (!password.id) {
        password.id = this.getUserId();
    }
    return this.http.post(this.api + UserService.RESET_PWD_URL, password);
  }

  public getAgencies(): Promise<Agency[]> {
    return this.http.get<Agency[]>( this.api + UserService.ANGENCY_URL).toPromise();
  }

  public getAuthories(): Promise<IAuthority[]> {
    return this.http.get<IAuthority[]>( this.api + UserService.AUTHORITY_URL).toPromise();
  }

  /**
   * Removes token and user details from localStorage and service's variables
   */
  public logout(): void {
    localStorage.removeItem(TOKEN_NAME);
    this._newcurrent.next('');
  }

  public isTokenExpired(): boolean {
    if (!this.getToken()) { return true; }

    const expire = new Date(0);
    expire.setUTCSeconds(this.getUser().exp);
    if (expire === undefined) {
      console.log('usr exp undefined ' + this.getUsername());
      return true;
    }
    const diff = expire.getTime() - (new Date()).getTime();
    if (diff > 0 ) {
      return false;
    }
    console.log(localStorage.getItem(UserService.USERINFO));
    console.log(JSON.stringify(this.getUser()));
    console.log(diff + ': ' + expire.getTime() + ' - ' + new Date().getTime() );
    return true;
  }

  public getUsername(): string {
    return this.getUser().sub || 'no name';
  }

  public getUserId(): string {
    console.log('getUserId->' + this.getUser().id);
    return this.getUser().id;
  }

  public  getEmail(): string {
    return this.getUser().email;
  }

  public  getRoles(): string[] {
    if ((this.getUser().role) && this.getUser().role instanceof Array ) {
      return this.getUser().role.map( e => e.authority);
    } else {
      return [];
    }
  }

  public  getAgency(): string {
    return this.getUser().agency;
  }

  public getToken(): string {
    const token = localStorage.getItem(TOKEN_NAME);
    if (token === 'undefined') {
      return null;
    } else {
      return token;
    }
  }

  private setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  private setUserData(userjson: any ): void {
    const response = userjson && userjson.token;
    if (response) {
      const token = response;
      const claims = this.getTokenClaims(token);
      claims.token = userjson.token;
      localStorage.setItem(UserService.USERINFO, JSON.stringify(claims));
      this._user = null;
      this._newcurrent.next(this.getUser().sub);
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
