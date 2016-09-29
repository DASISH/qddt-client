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

export class QuestionItem {
  id: string;
  question: Question;
  responseDomain: any;
  version: any;
  agency: any;
  name: any;
  changeKind: any;
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

  getQuestionItemPage(name: string = '', page: String = '0'): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': '';
    return this.get('questionitem/page?' + query + '&page=' + page);
  }

  createQuestionItem(question: any): any {
    return this.post(question,'questionitem/create');
  }

  updateQuestionItem(questionItem: QuestionItem) : any {
    return this.post(questionItem, 'questionitem');
  }

  getConceptsByQuestionitemId(id: string) {
    return this.get('concept/list/by-QuestionItem/'+ id);
  }
}
