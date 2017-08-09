import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Rx';
import { isNullOrUndefined } from 'util';

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
      return Observable.throw('Invalid token error');
    }
    if (error.status === 400)
      return Observable.throw(error['_body'].JSON()['exceptionMessage'] || 'Server error');

    if (!isNullOrUndefined(error.statusText)) {
      return Observable.throw(error.statusText || 'Server error');
    }

    if (!isNullOrUndefined(error['message'])) {
      return Observable.throw(error['message'] || 'Server error');
    }

    return Observable.throw(error);

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

  protected post(qddtEntity:any, url:String):any {
    return this.http.post(this.api + url,
      JSON.stringify(qddtEntity),
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

  protected delete(url:String):any {
    return this.http.delete(this.api + url,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.statusText;
      })
      .catch(this.handleError);
  }

}
