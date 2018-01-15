import { Injectable, Inject } from '@angular/core';
// import { Http } from '@angular/http';
import { API_BASE_HREF } from '../api';
import { Category, ResponseCardinality } from '../category/category.service';
import { BaseService } from '../shared/base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export const DATE_FORMAT: any = [
  {'id': 1, 'format': 'yyyy-mm-dd',         'label': 'Date' },
  {'id': 2, 'format': 'yyyy-mm-dd HH:mm:SS','label': 'DateTime' },
  {'id': 3, 'format': 'dd',                 'label': 'gDay' },
  {'id': 4, 'format': 'mm',                 'label': 'gMonth' },
  {'id': 5, 'format': 'mm-dd',              'label': 'gMonthDay' },
  {'id': 6, 'format': 'yyyy',               'label': 'gYear' },
  {'id': 7, 'format': 'yyyy-mm',            'label': 'gYearMonth' },
  {'id': 8, 'format': 'HH:mm:SS',           'label': 'Time' },
  {'id': 9, 'format': 'd mmm yyyy',         'label': 'Date-text-short' },
  {'id': 10, 'format': 'dddd d mmmm yyyy',  'label': 'Full-date-text' },
  ];

export class ResponseDomain {
  id: string;
  name: string;
  label: string;
  description: string;
  responseKind: string;
  displayLayout:any;
  managedRepresentation: Category;
  responseCardinality: ResponseCardinality;
  constructor() {
    this.managedRepresentation = null;
    this.responseCardinality = new ResponseCardinality();
  }
}

@Injectable()
export class ResponseDomainService  {

  constructor(protected http:HttpClient, @Inject(API_BASE_HREF) protected api:string) {
   //
  }

  create(responseDomain: ResponseDomain): Observable<any> {
    return this.http.post(this.api +responseDomain,'responsedomain/create');
  }

  update(responseDomain: ResponseDomain): Observable<any> {
    return this.http.post(this.api +responseDomain,'responsedomain/');
  }

  deleteResponseDomain(id: string): Observable<any> {
    return this.http.delete(this.api +'responsedomain/delete/' + id);
  }

  getResponseDomain(id: string): Promise<any> {
    return this.http.get(this.api +'responsedomain/' + id).toPromise();
  }
  getAll(domain: string, name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0? '&Name=' + name + '*': name;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api +'responsedomain/page/search?ResponseKind=' + domain + query + '&page=' + page)
      .toPromise();
  }

  getResponseDomainsRevisions(id: string) : Promise<any> {
    return this.http.get(this.api +'audit/responsedomain/' + id + '/all').toPromise();
  }

  getResponseDomainsRevision(id: string, rev: string) : Promise<any> {
    return this.http.get(this.api +'audit/responsedomain/' + id + '/' + rev).toPromise();
  }


}
