import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { Category } from '../category/category.service';
import { BaseService } from '../../common/base.service';

export class ResponseDomain {
  id: string;
  name: string;
  label: string;
  description: string;
  responseKind: string;
  managedRepresentation: Category;
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

}
