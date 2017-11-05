import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { Category, ResponseCardinality } from '../category/category.service';
import { BaseService } from '../../shared/base.service';

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
    this.managedRepresentation = new Category();
    this.responseCardinality = new ResponseCardinality();
  }
}

@Injectable()
export class ResponseDomainService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http, api);
  }

  create(responseDomain: ResponseDomain): any {
    return this.post(responseDomain,'responsedomain/create');
  }

  update(responseDomain: ResponseDomain): any {
    return this.post(responseDomain,'responsedomain/');
  }

  getResponseDomain(id: string): any {
    return this.get('responsedomain/' + id);
  }

  deleteResponseDomain(id: string): any {
    return this.delete('responsedomain/delete/' + id);
  }

  getAll(domain: string, name: string = '', page: String = '0', sort: String = ''): any {
    let query = name.length > 0? '&Name=' + name + '*': name;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('responsedomain/page/search?ResponseKind=' + domain + query + '&page=' + page);
  }

  getResponseDomainsRevisions(id: string) : any {
    return this.get('audit/responsedomain/' + id + '/all');
  }

  getResponseDomainsRevision(id: string, rev: string) : any {
    return this.get('audit/responsedomain/' + id + '/' + rev);
  }

}
