import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http } from '@angular/http';
// import DateTimeFormat = Intl.DateTimeFormat;
import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';


export class QuestionItem {
  id: string;
  question: string;
  intent: string;
  responseDomain: ResponseDomain;
  responseDomainRevision: number;
  version: any;
  agency: any;
  name: string;
  changeKind: any;
}

@Injectable()
export class QuestionService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    super(http, auth , api);
  }


  getQuestionItemPage(page: String = '0'): Promise<any> {
    return this.get('questionitem/page' + '?&page=' + page + this.pageSize );
  }

  getquestion(id: string): Promise<any> {
    return this.get('questionitem/' + id);
  }

  deleteQuestionItem(id: string): any {
    return this.delete('questionitem/delete/' + id);
  }

  searchQuestionItems(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&question=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('questionitem/page/search?' + 'page=' + page + this.pageSize + query);
  }

  createQuestionItem(question: any): any {
    return this.post(question, 'questionitem/create');
  }

  updateQuestionItem(questionItem: any): any {
    return this.post(questionItem, 'questionitem');
  }

  createCategory(category: any): any {
    return this.post(category, 'category/create/');
  }

  createResponseDomain(responseDomain: any): any {
    return this.post(responseDomain, 'responsedomain');
  }


  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('category/page/search/?level=GROUP_ENTITY&category=' + categoryKind
      + query + '&page=' + page + this.pageSize);
  }

  getResponseDomainsRevisions(id: string): Promise<any> {
    return this.get('audit/responsedomain/' + id + '/all');
  }

  getQuestionItemRevisions(id: string): Promise<any> {
    return this.get('audit/questionitem/' + id + '/all');
  }

  getQuestionItemRevision(id: string, rev: string): Promise<any> {
    return this.get('audit/questionitem/' + id + '/' + rev);
  }

  getControlConstructsByQuestionItem(id: string): Promise<any> {
    return this.get('controlconstruct/list/by-question/' + id);
  }


  getPdf(id: string): Observable<Blob> {
    return this.getBlob('questionitem/pdf/' + id);
  }
}
