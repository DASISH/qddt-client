import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions, ResponseContentType } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Rx';
// import { AlertService } from '../shared/altert/alter.service';

@Injectable()
export class BaseService {

  private headers: Headers;
  // private alertService: AlertService;

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    // this.alertService = new AlertService();
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
    if (error.status === 400) {
      // this.alertService.error(error['_body'].JSON()['exceptionMessage']);
      return Observable.throw(error['_body'].JSON || 'Server error');
    }
    if (!error.statusText) {
      // this.alertService.error(error.statusText);
      return Observable.throw(error.statusText || 'Server error');
    }

    if (!error['message']) {
      // this.alertService.error(error['message']);
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

  /*
  This function can retrieve blobs from all sources in backend
  typical : 'othermaterial/files/' + id
            'resource/pdf/' + id
   */
  protected getBlob(path: string): any {
    let options = new RequestOptions({headers: this.headers, responseType: ResponseContentType.Blob});
    return this.http.get(this.api + path,options)
      // .subscribe(
      //   data => {
      //     return data;
      //   },
      //   err => {
      //     this.handleError(err);
      //   });
      .map(res => res.blob())
      .catch(this.handleError);

  }

  protected uploadBlob(id: string, files: any): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if (jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({headers: headers});
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id, formData, options)
      .map((res: any) => {
        try {
          return res.json();
        } catch (e) {
          return [];
        }
      })
      .catch(this.handleError);
  }
}
