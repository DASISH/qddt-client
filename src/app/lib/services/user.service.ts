import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { PropertyStoreService } from './property.service';
import { Agency, IPassword, User, UserJson } from '../classes';
import { ActionKind, AuthorityKind, ElementKind } from '../enums';
import { isString, TOKEN_NAME } from '../consts';
import { IAuthority } from '../interfaces';
import { TokenStorageService } from './token-storage.service';


/**
 * UserService uses JSON-Web-Token authorization strategy.
 * Fetched token and user details are stored in localStorage.
 */
@Injectable()
export class UserService {
  public static readonly SIGNIN_URL = 'login';
  public static readonly AGENCY_URL = 'agency/all';
  public static readonly RESET_PWD_URL = 'user/resetpassword';
  public static readonly UPDATE_URL = 'user';
  public static readonly AUTHORITY_URL = 'authority/all';

  private static readonly AGENCIES = 'AGENCIES';
  private static readonly AUTHORITIES = 'AUTHORITIES';
  private static readonly USER = 'USER_REF';

  public loggedIn = new BehaviorSubject<boolean>(false);

  private user: User;
  private roles: number;

  private readonly getUserAsync = (id: string) => this.http.get<User>(this.api + 'user/' + id).toPromise();

  constructor(private http: HttpClient, private tokenStore: TokenStorageService, @Inject(API_BASE_HREF) private api: string, private property: PropertyStoreService) {
    if (this.isTokenExpired()) {
      this.logout();
    } else {
      this.loadUserFromToken();
    }
  }

  public canDo(action: ActionKind, kind: ElementKind): boolean {
    // console.debug('canDo -> Action:' + ActionKind[action] + ' Kind:' + kind);
    function canRead(roles: number) {
      if (kind >= ElementKind.INSTRUCTION && roles < AuthorityKind.ROLE_ADMIN) {
        console.debug('canRead false ' + kind);
        return false;
      }
      if (roles >= +AuthorityKind.ROLE_VIEW) {
        console.debug('canRead true ' + kind);
        return true;
      }
      console.debug('canRead ?' + kind + ' + ' + ElementKind.PUBLICATION + ' = ' + (kind == ElementKind.PUBLICATION));

      return (kind === ElementKind.PUBLICATION);
    }

    function canExport() {
      return !(kind === ElementKind.CATEGORY || kind === ElementKind.MISSING_GROUP ||
        kind === ElementKind.RESPONSEDOMAIN || kind === ElementKind.UNIVERSE ||
        kind === ElementKind.INSTRUCTION);
    }

    function canUpdate(roles: number) {
      if ((kind === ElementKind.USER && roles < AuthorityKind.ROLE_ADMIN)
        || (kind === ElementKind.CHANGE_LOG || kind === ElementKind.REFERENCED || kind === ElementKind.AUTHOR)) {
        return false;
      } else if (roles >= +AuthorityKind.ROLE_EDITOR) {
        return true;
      } else if (roles >= +AuthorityKind.ROLE_CONCEPT) {
        return (kind === ElementKind.TOPIC_GROUP || kind === ElementKind.CONCEPT);
      } else {
        return false;
      }
    }

    function canDelete(roles: number) {
      if (kind === ElementKind.CHANGE_LOG) {
        return false;
      } else if (roles >= +AuthorityKind.ROLE_ADMIN) {
        return true;
      } else if (roles >= +AuthorityKind.ROLE_EDITOR) {
        return (kind !== ElementKind.SURVEY_PROGRAM && kind !== ElementKind.STUDY);
      } else {
        return false;
      }
    }

    switch (action) {
      case ActionKind.Read:
        return canRead(this.roles);
      case ActionKind.Export:
        return canExport();
      case ActionKind.Create:
      case ActionKind.Update:
        return canUpdate(this.roles);
      case ActionKind.Delete:
        return canDelete(this.roles);
      default:
        return false;
    }
  }

  public getUser(): User {
    return this.user || new User();
  }

  public async signIn(requestParam: IPassword) {
    const response = await this.http.post<any>(this.api + UserService.SIGNIN_URL, requestParam).toPromise();
    console.log(response);
    if (response && response.token) {
      this.tokenStore.saveToken(response.token)
      this.loadUserFromToken();
    }
    return response;
  }

  /**
   * Removes token and user details from localStorage and service's variables
  */
  public logout(): void {
      this.tokenStore.signOut()
      localStorage.removeItem(TOKEN_NAME);
      this.loggedIn.next(false);
  }



  public saveUser(userdata: UserJson): Observable<any> {
    return this.http.post(this.api + UserService.UPDATE_URL, userdata);
  }

  public resetPassword(password: IPassword): Observable<any> {
    if (!password.id) {
      password.id = this.getUserId();
    }
    return this.http.post(this.api + UserService.RESET_PWD_URL, password);
  }

  public getCurrentUser(): Promise<User> {
    if (!this.getUserId) throw new Error('User not logged in');
    if (this.property.has(UserService.USER)) {
      const user = this.property.get(UserService.USER) as User;
      if (user.id === this.getUserId()) {
        return Promise.resolve(user);
      }
      this.property.delete(UserService.USER);
    }
    return this.getUserAsync(this.getUserId())
      .then(result => {
        this.property.set(UserService.USER, result);
        return result;
      });
  }

  public async getCurrentAgency(): Promise<Agency> {
    return (await this.getCurrentUser()).agency;
  }

  public getAgencies(): Promise<Agency[]> {
    if (this.property.has(UserService.AGENCIES)) {
      const list = this.property.get(UserService.AGENCIES);
      return Promise.resolve(list);
    }
    return this.http.get<Agency[]>(this.api + UserService.AGENCY_URL).toPromise()
      .then(result => {
        this.property.set(UserService.AGENCIES, result);
        return result;
      });
  }

  public getAuthorities(): Promise<IAuthority[]> {
    if (this.property.has(UserService.AUTHORITIES)) {
      const list = this.property.get(UserService.AUTHORITIES);
      return Promise.resolve(list);
    }
    return this.http.get<IAuthority[]>(this.api + UserService.AUTHORITY_URL).toPromise()
      .then(result => {
        this.property.set(UserService.AUTHORITIES, result);
        return result;
      });
  }

  public isTokenExpired(): boolean {
    if (! this.tokenStore.getToken()) { return true; }

    const expire = new Date(0);
    expire.setUTCSeconds(this.getUser().exp);
    if (expire === undefined) {
      console.log('usr exp undefined ->'); // + this.getUsername());
      return true;
    }
    const clientTime = new Date();
    const diff = expire.getTime() - clientTime.getTime();
    return (diff < 0);
  }

  public getUsername(): string {
    return this.getUser().sub || 'no name';
  }

  public getUserId(): string {
    // console.debug('getUserId->' + this.getUser().id);
    return this.getUser().id || '';
  }

  public getEmail(): string {
    return this.getUser().email || this.property.userSetting.email || '';
  }

  public getRoles(): string[] {
    let roles = this.getUser().role

    if (isString(roles)) {

      return roles.split(',').map(value => value.trim())

    } else {
      return roles
    }
  }

  private loadUserFromToken(): void {
    this.user = this.getTokenClaims(this.tokenStore.getToken());
    this.property.userSetting.email = this.user.email;
    this.roles = 0;
    this.getRoles().forEach((role) => this.roles += +AuthorityKind[role]);
    // console.debug('logged in fires');
    this.loggedIn.next(true);
  }

  // Retrieves user details from token
  private getTokenClaims(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

}
