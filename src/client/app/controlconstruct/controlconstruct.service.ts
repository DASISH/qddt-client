import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { QuestionItem } from '../question/question.service';
import { AuthService } from '../auth/auth.service';

export class Universe {
  id: string;
  description: string;
}

export class ControlConstruct {
  id: string;
  name: string;
  description: string;
  questionItem: QuestionItem;
  questionItemRevision: number;
  otherMaterials: any;
  controlConstructKind: string;
  universe: Universe[];
  preInstructions: Instruction[];
  postInstructions: Instruction[];
}

export class Instruction {
  id: string;
  description: string;
}

@Injectable()
export class ControlConstructService  {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    //
  }

  create(cc: ControlConstruct): any {
    return this.http.post(this.api+'controlconstruct/create', cc);
  }

  getControlConstruct(id: string):   Promise<any>  {
    return this.http.get(this.api +'controlconstruct/' + id);
  }

  getControlConstructRevision(id: string, rev: string):   Promise<any>  {
    return this.http.get(this.api +'audit/controlconstruct/' + id + '/' + rev);
  }

  getFile(id: string):   Promise<any>  {
    return this.getBlob('othermaterial/files/' + id);
  }

  uploadFile(id: string, files: any): any {
    return this.uploadBlob(id, files);
  }

  deleteFile(id: string) {
    return this.delete('othermaterial/delete/' + id);
  }

  getPdf(id: string): Promise<any>  {
    return this.getBlob('controlconstruct/pdf/' + id);
  }

  update(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/');
  }

  getControlConstructsByQuestionItem(id: string): Promise<any>  {
    return this.http.get(this.api +'controlconstruct/list/by-question/' + id);
  }

  getQuestionItems(key: string): Promise<any> {
    return this.http.get(this.api +'questionitem/page');
  }

  getQuestionItemsRevisions(id: string): Promise<any> {
    return this.http.get(this.api +'audit/questionitem/' + id + '/all');
  }

  deleteControlConstruct(id: string): any {
    return this.delete('controlconstruct/delete/' + id);
  }

  getConceptsByQuestionitemId(id: string): Promise<any> {
    return this.http.get(this.api +'concept/list/by-QuestionItem/' + id);
  }

  searchControlConstructs(name: string = '%', questionText: string = '%', page: String = '0', sort: string = ''): Promise<any> {
    let query = '&name=' + name + '&questiontext=' + questionText;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api +'controlconstruct/page/search?constructkind=QUESTION_CONSTRUCT' + '&page=' + page + this.pageSize + query);
  }

  searchQuestionItemsByNameAndQuestion(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&question=' + '*' + name + '*' + '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api +'questionitem/page/search?' + 'page=' + page + this.pageSize + query);
  }

  searchInstructions(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api +'instruction/page/search?' + 'page=' + page + this.pageSize + query);
  }

  searchUniverses(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api + 'universe/page/search?' + 'page=' + page + this.pageSize + query);
  }
}
