import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../api';
import { Category, ResponseCardinality } from '../category/category.service';
import { Observable } from 'rxjs/Observable';
import { IEntityAudit, IEntityEditAudit, IVersion } from '../shared/elementinterfaces/entityaudit';
import { ElementKind, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

export const DATE_FORMAT: any = [
  {'id': 1, 'format': 'yyyy-mm-dd',         'label': 'Date' },
  {'id': 2, 'format': 'yyyy-mm-dd HH:mm:SS', 'label': 'DateTime' },
  {'id': 3, 'format': 'dd',                 'label': 'gDay' },
  {'id': 4, 'format': 'mm',                 'label': 'gMonth' },
  {'id': 5, 'format': 'mm-dd',              'label': 'gMonthDay' },
  {'id': 6, 'format': 'yyyy',               'label': 'gYear' },
  {'id': 7, 'format': 'yyyy-mm',            'label': 'gYearMonth' },
  {'id': 8, 'format': 'HH:mm:SS',           'label': 'Time' },
  {'id': 9, 'format': 'd mmm yyyy',         'label': 'Date-text-short' },
  {'id': 10, 'format': 'dddd d mmmm yyyy',  'label': 'Full-date-text' },
  ];

export class ResponseDomain implements IEntityEditAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  responseKind: string;
  displayLayout: any;
  managedRepresentation: Category;
  responseCardinality: ResponseCardinality;
  classKind = ElementKind[ElementKind.RESPONSEDOMAIN];
  comments: any[];
  constructor() {
    this.managedRepresentation = new Category();
    this.responseCardinality = new ResponseCardinality();
  }

  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;
}

@Injectable()
export class ResponseDomainService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
   //
  }

  create(responseDomain: ResponseDomain): Observable<any> {
    return this.http.post(this.api + 'responsedomain/create' , responseDomain);
  }

  update(responseDomain: ResponseDomain): Observable<any> {
    return this.http.post(this.api + 'responsedomain/' , responseDomain);
  }

  deleteResponseDomain(id: string): Observable<any> {
    return this.http.delete(this.api + 'responsedomain/delete/' + id);
  }

  getResponseDomain(id: string): Promise<any> {
    return this.http.get(this.api + 'responsedomain/' + id).toPromise();
  }

  getAll(domain: string, searchString: string = '', page: Page ): Promise<any> {
    const qe = QDDT_ELEMENTS[ElementKind.RESPONSEDOMAIN];
    const args = searchString.trim().split(' ');
    const queries = [];

    if (args.length === qe.fields.length) {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + args[i] + '*' );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + searchString + '*' );
      }
    }

    let query = '';
    if (queries.length > 0) { query = '?' + queries.join('&'); }
    query += '&ResponseKind=' + domain;
    query += page.queryPage();

    return this.http.get(this.api + 'responsedomain/page/search' + query)
      .toPromise();
  }

  getResponseDomainsRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/responsedomain/' + id + '/all').toPromise();
  }

  getResponseDomainsRevision(id: string, rev: string): Promise<any> {
    return this.http.get(this.api + 'audit/responsedomain/' + id + '/' + rev).toPromise();
  }


}
