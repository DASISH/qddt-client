import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../api';
import {IEntityAudit, IEntityEditAudit} from '../shared/elementinterfaces/entityaudit';
import {ElementKind} from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

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

export class Category implements IEntityEditAudit {
  id: string;
  name: string;
  classKind = ElementKind[ElementKind.CATEGORY];
  label: string;
  description: string;
  inputLimit: ResponseCardinality;
  hierarchyLevel: string;
  categoryType: string;
  children: Category[];
  comments: any[];
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

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {
    // super(http, auth , api);
  }

  save(category: Category): Observable<Category> {
    return this.http.post<Category>(this.api + 'category/create/', category);
  }

  edit(category: Category):  Observable<Category> {
    return this.http.post<Category>(this.api + 'category/', category);
  }

  deleteCategory(categoryId: string): any {
    return this.http.delete(this.api + 'category/delete/' + categoryId);
  }

  get(uuid: string): Promise<Category> {
    return this.http.get<Category>(this.api + 'category/' + uuid).toPromise();
  }

  getAll(): any {
    return this.http.get(this.api + 'category/page/search/?level=ENTITY' + new Page().queryPage() ).toPromise();
  }

  getByCategoryKind(categoryKind: String, name: String = '*',  page: Page): Promise<any>  {
    const query = 'level=ENTITY&category=' + categoryKind + '&name=' + name +  page.queryPage();
    return this.http.get(this.api + 'category/page/search/?' + query).toPromise();
  }

  getAllByLevel(level: String, name: String = '', page: Page):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : name;
    query += page.queryPage();
    return this.http.get(this.api + 'category/page/search/?level=' + level + query).toPromise();
  }

  getAllByLevelAndPage(level: String, name: String = '', page: Page):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    query += page.queryPage();
    return this.http.get(this.api + 'category/page/search/?level=' + level + query).toPromise();
  }

  getAllTemplatesByCategoryKind(categoryKind: String, name: String = '', page: Page):  Promise<any> {
    let query = name.length > 0 ? '&name=' + '*' + name + '*' : '';
    query += page.queryPage();
    return this.http.get(this.api + 'category/page/search/?level=GROUP_ENTITY&category=' + categoryKind + query )
    .toPromise();
  }
}
