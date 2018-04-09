import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { Observable } from 'rxjs/Observable';
import { Category } from '../category/category.service';
import { IEntityEditAudit, IVersion, IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { Page } from '../shared/table/table.page';

export class QuestionItem implements IEntityEditAudit {

  id: string;
  agency: IEntityAudit;
  name: string;
  modified: number;
  version: IVersion;
  classKind: string;
  basedOnObject: string;
  basedOnRevision: number;
  question: string;
  intent: string;
  responseDomain: ResponseDomain;
  responseDomainName: String;
  responseDomainRevision: number;
  conceptRefs: any;

  constructor() {
    this.classKind = 'QUESTION_ITEM';
  }
}


@Injectable()
export class QuestionService  {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) { }


  getQuestionItemPage(page: Page ): Promise<any> {
    return this.http.get(this.api + 'questionitem/page?' + page.queryPage() )
      .toPromise();
  }

  getquestion(id: string): Promise<any> {
    return this.http.get(this.api + 'questionitem/' + id)
      .toPromise();
  }

  deleteQuestionItem(id: string): any {
    return this.http.delete(this.api + 'questionitem/delete/' + id);
  }

  searchQuestionItems(name: string = '', page: Page): Promise<any> {
    let query = name.length > 0 ? '&question=' + name + '*' : '';
    query += page.queryPage();
    return this.http.get(this.api + 'questionitem/page/search?' + query)
      .toPromise();
  }

  createQuestionItem(question: QuestionItem):  Observable<QuestionItem> {
    return this.http.post<QuestionItem>(this.api + 'questionitem/create', question);
  }

  updateQuestionItem(questionItem: QuestionItem):  Observable<QuestionItem> {
    return this.http.post<QuestionItem>(this.api + 'questionitem', questionItem);
  }

  createCategory(category: Category):  Observable<Category> {
    return this.http.post<Category>(this.api + 'category/create/', category);
  }

  createResponseDomain(responseDomain: ResponseDomain):  Observable<ResponseDomain> {
    return this.http.post<ResponseDomain>(this.api + 'responsedomain', responseDomain);
  }


  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: Page): Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    query += page.queryPage();
    return this.http.get(this.api + 'category/page/search/?level=GROUP_ENTITY&category=' + categoryKind + query )
      .toPromise();
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
  }

  getPdf(id: string): Observable<Blob> {
    return this.http.get(this.api + 'questionitem/pdf/' + id, { responseType: 'blob' });
  }
}
