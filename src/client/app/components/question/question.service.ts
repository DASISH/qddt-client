import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import DateTimeFormat = Intl.DateTimeFormat;

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

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

  getQuestionItemPage(page: String = '0'): any {
    return this.get('questionitem/page' + '?&page=' + page);
  }

  searchQuestionItems(name: string = '', page: String = '0'): any {
    let query = name.length > 0? '&question=' + '*' + name +'*': '';
    return this.get('questionitem/page/search?' + 'page=' + page + query);
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

  createCategory(category: any): any {
    return this.post(category,'category/create/');
  }

  createResponseDomain(responseDomain: any): any {
    return this.post(responseDomain,'responsedomain/create');
  }

  createMixedResponseDomain(responseDomaindId: string, missingId: string): any {
    return this.get('responsedomain/createmixed?responseDomaindId=' + responseDomaindId + '&missingId=' + missingId);
  }

  createResponseDomainWithMissing(responseDomainId: any, missingId: string): any {
    return this.get('responsedomain/createmixed?responseDomaindId='
      + responseDomainId + '&missingId=' + missingId);
  }
}
