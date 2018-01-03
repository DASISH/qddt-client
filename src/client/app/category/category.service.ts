import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';

export class ResponseCardinality {
   minimum: number;
   maximum: number;
  constructor() {
    this.minimum =1;
    this.maximum =1;
  }
}

export class Code {
  codeValue: string;
  alignment: string;
  constructor() {
    this.alignment='text-left';
    this.codeValue='0';
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
  code:Code;
  format:any;
  constructor() {
    this.label='';
    this.name='';
    this.children = [];
    this.inputLimit = new ResponseCardinality();
    this.code = new Code();
  }
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

  deleteCategory(categoryId: string): any {
    return this.delete('category/delete/' + categoryId);
  }

  getAll(): any {
    return this.get('category/page/search/?level=ENTITY');
  }

  getByCategoryKind(categoryKind: String, name: String = '*',  page: String = '0', sort: String = ''): any {
    let query = 'level=ENTITY&category=' + categoryKind + '&name=' + name +  '&page=' + page;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('category/page/search/?' + query);
  }

  getAllByLevel(level: String, name: String = '', sort: String = ''): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': name;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('category/page/search/?level=' + level + query);
  }

  getAllByLevelAndPage(level: String, name: String = '', page: String = '0', sort: String = ''): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('category/page/search/?level=' + level + query
      + '&page=' + page);
  }

  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: String = '0', sort: String = ''): any {
    let query = name.length > 0? '&name=' + '*' + name + '*': '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('category/page/search/?level=GROUP_ENTITY&category=' + categoryKind
      + query + '&page=' + page);
  }
}
