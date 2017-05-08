import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class SurveyProgram {
  id: string;
  name: string;
  modified: any;
  authors: any[];
}

@Injectable()
export class SurveyService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(surveyProgram: SurveyProgram): any {
    return this.post(surveyProgram, 'surveyprogram/create');
  }

  save(surveyProgram: SurveyProgram): any {
    return this.post(surveyProgram, 'surveyprogram/');
  }

  getAll():any {
    return this.get('surveyprogram/list/by-user');
  }

}
