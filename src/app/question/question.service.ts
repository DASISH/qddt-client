import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { Observable } from 'rxjs/Observable';


export class QuestionItem {
  id: string;
  name: string;
  version: any;
  changeKind: any;
  agency: any;
  question: string;
  intent: string;
  responseDomain: ResponseDomain;
  responseDomainName: String;
  responseDomainRevision: number;
  conceptRefs: any;
}


@Injectable()
export class QuestionService  {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) { }


  getQuestionItemPage(page: String = '0'): Promise<any> {
    return this.http.get(this.api + 'questionitem/page' + '?&page=' + page + this.pageSize )
      .toPromise();
  }

  getquestion(id: string): Promise<any> {
    return this.http.get(this.api + 'questionitem/' + id)
      .toPromise();
  }

  deleteQuestionItem(id: string): any {
    return this.http.delete(this.api + 'questionitem/delete/' + id);
  }

  searchQuestionItems(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&question=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'questionitem/page/search?' + 'page=' + page + this.pageSize + query)
      .toPromise();
  }

  createQuestionItem(question: any):  Observable<any> {
    return this.http.post(this.api + 'questionitem/create', question);
  }

  updateQuestionItem(questionItem: any):  Observable<any> {
    return this.http.post(this.api + 'questionitem', questionItem);
  }

  createCategory(category: any):  Observable<any> {
    return this.http.post(this.api + 'category/create/', category);
  }

  createResponseDomain(responseDomain: any):  Observable<any> {
    return this.http.post(this.api + 'responsedomain', responseDomain);
  }


  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'category/page/search/?level=GROUP_ENTITY&category=' + categoryKind
      + query + '&page=' + page + this.pageSize)
      .toPromise();
      // .catch(err => { throw Error(err.message);});

  }

  getResponseDomainsRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/responsedomain/' + id + '/all')
      .toPromise()
      .catch(err => { throw Error(err.message); });

  }

  getQuestionItemRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/questionitem/' + id + '/all')
      .toPromise();
  }

  getQuestionItemRevision(id: string, rev: string): Promise<any> {
    return this.http.get(this.api + 'audit/questionitem/' + id + '/' + rev)
      .toPromise();
      // .catch(err => { throw Error(err.message);});

  }

  getControlConstructsByQuestionItem(id: string): Promise<any> {
    return this.http.get(this.api + 'controlconstruct/list/by-question/' + id)
      .toPromise();
      // .catch(err => { throw Error(err.message);});

  }


  getPdf(id: string): Observable<Blob> {
    return this.http.get(this.api + 'questionitem/pdf/' + id, {responseType: 'blob'});

  }
}
