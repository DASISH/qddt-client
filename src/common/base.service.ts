import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../api';
import * as Rx from 'rxjs/Rx';


@Injectable()
export class BaseService {

  private headers: Headers;

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }


  protected handleError(error:Response) {
    console.log(error);

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
        return res.json();
      })
      .catch(this.handleError);
  }

}
