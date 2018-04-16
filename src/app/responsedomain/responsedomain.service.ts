import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { Page } from '../shared/classes/classes';
import { IEntityAudit, IEntityEditAudit, IVersion } from '../shared/classes/interfaces';
import { Category, ResponseCardinality } from '../category/category.classes';
import { ElementKind } from '../shared/classes/enums';
import { QDDT_QUERY_INFOES} from '../shared/classes/constants';
import { DomainKind, ResponseDomain} from './responsedomain.classes';

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



@Injectable()
export class ResponseDomainService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
   //
  }

  create(responseDomain: ResponseDomain): Observable<ResponseDomain> {
    return this.http.post<ResponseDomain>(this.api + 'responsedomain/create' , responseDomain);
  }

  update(responseDomain: ResponseDomain): Observable<ResponseDomain> {
    return this.http.post<ResponseDomain>(this.api + 'responsedomain/' , responseDomain);
  }

  deleteResponseDomain(id: string): Observable<any> {
    return this.http.delete(this.api + 'responsedomain/delete/' + id);
  }

  getResponseDomain(id: string): Promise<ResponseDomain> {
    return this.http.get<ResponseDomain>(this.api + 'responsedomain/' + id).toPromise();
  }

  getAll(domain: string, searchString: string = '', page: Page ): Promise<any> {
    const qe = QDDT_QUERY_INFOES[ElementKind.RESPONSEDOMAIN];
    const args = searchString.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i < args.length; i++) {
        queries.push(qe.fields[i] + '=' + args[i].trim() );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=' + searchString.trim() );
      }
    }

    let query = '';
    if (queries.length > 0) { query = '?' + queries.join('&'); }
    query += '&ResponseKind=' + domain;
    query += page.queryPage();

    return this.http.get(this.api + 'responsedomain/page/search' + query).toPromise();
  }

  getResponseDomainsRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/responsedomain/' + id + '/all').toPromise();
  }

  getResponseDomainsRevision(id: string, rev: string): Promise<any> {
    return this.http.get(this.api + 'audit/responsedomain/' + id + '/' + rev).toPromise();
  }


}
