import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class ResponseCardinality {
   minimum: string;
   maximum: string;
}

export class Code {
  codeValue: string;
}

export class Category {
  id: string;
  name: string;
  label: string;
  description: string;
  inputLimit: ResponseCardinality;
  hierarchyLevel: string;
  categoryType: string;
  children: Category[];
  code:Code;
}

@Injectable()
export class CategoryService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
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

  getByCategoryKind(categoryKind: String, page: String = '0'): any {
    return this.get('category/page/search/?level=ENTITY&category=' + categoryKind
      + '&page=' + page);
  }

  getAllByLevel(level: String, name: String = ''): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': name;
    return this.get('category/page/search/?level=' + level + query);
  }

  getAllByLevelAndPage(level: String, name: String = '', page: String = '0'): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': '';
    return this.get('category/page/search/?level=' + level + query
      + '&page=' + page);
  }

  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: String = '0'): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': '';
    return this.get('category/page/search/?level=GROUP_ENTITY&category=' + categoryKind
      + query + '&page=' + page);
  }
}
