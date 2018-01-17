import { Injectable, Inject } from '@angular/core';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ResponseContentType } from '@angular/http';

@Injectable()
export class BaseService {

  private headers: HttpHeaders;

  constructor(protected http:HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api:string) {
    // this.alertService = new AlertService();
    // let headers = new HttpHeaders();
    // // headers.append('Content-Type', 'application/json');
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Access-Control-Allow-Headers', 'Origin, Authorization, Content-Type');
  }

  protected handleError(error:Response) {
    // if(error.status === 401 && error.text().then().indexOf('invalid_token') >= 0) {
    //   localStorage.removeItem('user');
    //   return Observable.throw('Invalid token error');
    // }
    if (error.status === 400) {
      // this.alertService.error(error['_body'].JSON()['exceptionMessage']);
      return Observable.throw(error['_body'].JSON || error.statusText ||'Server error');
    }
    if (error.statusText) {
      // this.alertService.error(error.statusText);
      return Observable.throw(error.statusText || 'Server error');
    }

    if (error['message']) {
      // this.alertService.error(error['message']);
      return Observable.throw(error['message'] || 'Server error');
    }

    return Observable.throw(error);

  }

  protected get(url:String):Promise<any> {
    return this.http
      .get<any>(this.api + url)
      .toPromise()
      .catch(this.handleError);
  }

  protected post(qddtEntity:any, url:String):any {
    return this.http
      .post(this.api + url,JSON.stringify(qddtEntity))
      .toPromise()
      // {
      //   headers: this.headers
      // })
      // .map((res:Response) => {
      //   try {
      //     return res.json();
      //   } catch (e) {
      //     return [];
      //   }
      // })
      .catch(this.handleError);
  }

  protected delete(url:String):any {
    return this.http.delete(this.api + url,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res;
      })
      .catch(this.handleError);
  }

  /*
  This function can retrieve blobs from all sources in backend
  typical : 'othermaterial/files/' + id
            'resource/pdf/' + id
   */
  protected getBlob(path: string):  Observable<Blob> {
    return this.http.get(this.api + path, {responseType: 'blob'})
      .catch(this.handleError);
  }

  protected uploadBlob(id: string, files: any): any {
    // let headers = new Headers();
    // headers.append('Authorization', 'Bearer  ' + this.auth.getToken());
    // let options = new RequestOptions({headers: headers});
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id, formData)
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
