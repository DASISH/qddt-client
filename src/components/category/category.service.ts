import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import * as Rx from 'rxjs/Rx';
import {BaseService} from '../../common/base.service';

export class Category {
  id: string;
  name: string;
  label: string;
  description: string;
}

@Injectable()
export class CategoryService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  static logError(err: string) {
    console.log('CategoryService: ', err);
  }

  save(category: Category): any {
    return this.post(category,'category/create/');
  }

  edit(category: Category): any {
    return this.post(category,'category/');
  }

  getAll(): any {
    return this.get('category/page/search/?level=ENTITY');
  }
  
}
