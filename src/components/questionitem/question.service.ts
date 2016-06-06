import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

export class Question {
  id: string;
  name: string;
  modified:DateTimeFormat;
}

@Injectable()
export class QuestionService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(question: Question): any {
    return this.post(question,'question/create');
  }

  getPage(): any {
    return this.get('question/page');
  }

}
