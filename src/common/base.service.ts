import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../api';
import * as Rx from 'rxjs/Rx';

@Injectable()
export class BaseService {

  private headers: Headers;

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    this.headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      this.headers.append('Authorization', 'Bearer  '
        + JSON.parse(jwt).access_token);
    }
    this.headers.append('Content-Type', 'application/json');
  }

  protected handleError(error:Response) {
    if(error.status === 401 && error.text().indexOf('invalid_token') >= 0) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      return Rx.Observable.throw('Invalid token error');
    }

    return Rx.Observable.throw(error.json().exceptionMessage || 'Server error');
  }

  protected get(url:String):any {
    return this.http.get(this.api + url,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  protected post(concept:any, url:String):any {
    return this.http.post(this.api + url,
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        try {
          return res.json();
        } catch (e) {
          return [];
        }
      })
      .catch(this.handleError);
  }

}
