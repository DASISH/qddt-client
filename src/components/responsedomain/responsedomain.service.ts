import { Injectable, Inject } from 'angular2/core';
import { Http } from 'angular2/http';
import {API_BASE_HREF} from '../../api';
import {Category} from '../category/category.service';
import {BaseService} from '../../common/base.service';

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

  getAll(domain: string, name: string = '', page: String = '0'): any {
    let query = name.length > 0? '&Name=' + name + '*': name;
    return this.get('responsedomain/page/search?ResponseKind=' + domain + query + '&page=' + page);
  }

}
