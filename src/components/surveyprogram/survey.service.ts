import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

export class SurveyProgram {
  id: string;
  name: string;
  modified:DateTimeFormat;
  authors: any[];
}

@Injectable()
export class SurveyService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  static logError(err: string) {
    console.log('SurveyService: ', err);
  }

  save(surveyProgram: SurveyProgram): any {
    return this.post(surveyProgram, 'surveyprogram/create');
  }


  getAll():any {
    return this.get('surveyprogram/list/by-user');
  }

  attachAuthor(surveyId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&surveyId=' +surveyId);
  }

  deattachAuthor(surveyId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&surveyId=' +surveyId);
  }

}
