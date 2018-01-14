import { Injectable, Inject } from '@angular/core';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class ResponseCardinality {
   minimum: number;
   maximum: number;
  constructor() {
    this.minimum = 1;
    this.maximum = 1;
  }
}

export class Code {
  codeValue: string;
  alignment: string;
  constructor() {
    this.alignment = 'text-left';
    this.codeValue = '0';
  }
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
  code: Code;
  format: any;
  constructor() {
    this.label = '';
    this.name = '';
    this.children = [];
    this.inputLimit = new ResponseCardinality();
    this.code = new Code();
  }
}

@Injectable()
export class CategoryService  {

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    //super(http, auth , api);
  }

  save(category: Category): Promise<any> {
    return this.http.post(this.api + 'category/create/', category)
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }

  edit(category: Category):  Observable<any> {
    return this.http.post(this.api+ 'category/',category);
  }

  deleteCategory(categoryId: string): any {
    return this.http.delete(this.api + 'category/delete/' + categoryId);
  }

  getAll(): any {
    return this.http.get(this.api +'category/page/search/?level=ENTITY')
    .toPromise()
    .catch(err => {throw Error(err.message);});
  }

  getByCategoryKind(categoryKind: String, name: String = '*',  page: String = '0', sort: String = ''): Promise<any>  {
    let query = 'level=ENTITY&category=' + categoryKind + '&name=' + name +  '&page=' + page;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api+ 'category/page/search/?' + query)
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }

  getAllByLevel(level: String, name: String = '', sort: String = ''):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : name;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'category/page/search/?level=' + level + query)
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }

  getAllByLevelAndPage(level: String, name: String = '', page: String = '0', sort: String = ''):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api +'category/page/search/?level=' + level + query + '&page=' + page)
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }

  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: String = '0', sort: String = ''):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'category/page/search/?level=GROUP_ENTITY&category=' + categoryKind + query + '&page=' + page)
    .toPromise()
    .catch(err => { throw Error(err.message);});
  }
}
