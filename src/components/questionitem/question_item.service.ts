import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';
import {Question} from '../question/question.service';
import {ResponseDomain} from '../responsedomain/responsedomain.service';

export class QuestionItem {
  id: string;
  question: Question;
  responsedomain:ResponseDomain;
  modified:DateTimeFormat;
}

@Injectable()
export class QuestionItemService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(question: QuestionItem): any {
    return this.post(question,'questionitem/create');
  }

  getPage(): any {
    return this.get('questionitem/page');
  }

}
