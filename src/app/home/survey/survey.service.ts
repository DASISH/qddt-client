import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../../api';
import { Study } from '../study/study.service';


export class SurveyProgram {
  id: string;
  name: string;
  description: string;
  authors: any[];
  comments: any[];
  modified: any;
  archived: boolean;
  studies: Study[];
}

@Injectable()
export class SurveyService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  create(surveyProgram: SurveyProgram): Observable<any> {
    return this.http.post(this.api + 'surveyprogram/create', surveyProgram);
  }

  save(surveyProgram: SurveyProgram):  Observable<any> {
    return this.http.post(this.api + 'surveyprogram/', surveyProgram);
  }

  deleteSurvey(surveyId: string): Observable<any> {
    return this.http.delete(this.api + 'surveyprogram/delete/' + surveyId);
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
