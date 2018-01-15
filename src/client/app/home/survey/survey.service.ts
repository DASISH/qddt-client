import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../../api';


export class SurveyProgram {
  id: string;
  name: string;
  description: string;
  modified: any;
}

@Injectable()
export class SurveyService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  create(surveyProgram: SurveyProgram): Observable<any> {
    return this.http.post(this.api + 'surveyprogram/create',surveyProgram);
  }

  save(surveyProgram: SurveyProgram):  Observable<any> {
    return this.http.post(this.api + 'surveyprogram/',surveyProgram);
  }

  getAll(): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/list/by-user')
    .toPromise();
  }

  getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'surveyprogram/pdf/' + id, {responseType: 'blob'})
    .toPromise();
  }
}
