import { Injectable, Inject } from '@angular/core';
// import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../shared/base.service';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class SurveyProgram {
  id: string;
  name: string;
  description: string;
  modified: any;
}

@Injectable()
export class SurveyService  {

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    //super(http, auth , api);
  }

  create(surveyProgram: SurveyProgram): Observable<any> {
    return this.http.post(this.api + 'surveyprogram/create',surveyProgram);
  }

  save(surveyProgram: SurveyProgram):  Observable<any> {
    return this.http.post(this.api + 'surveyprogram/',surveyProgram);
  }

  getAll(): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/list/by-user')
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }

  getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'surveyprogram/pdf/' + id, {responseType: 'blob'})
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }
}
