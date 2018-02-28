import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../question/question.service';

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

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    //
  }

  getControlConstruct(id: string): Promise<any>  {
    return this.http.get(this.api + 'controlconstruct/' + id).toPromise();
  }

  getControlConstructRevision(id: string, rev: string): Promise<any>  {
    return this.http.get(this.api + 'audit/controlconstruct/' + id + '/' + rev).toPromise();
  }

  getControlConstructsByQuestionItem(id: string): Promise<any>  {
    return this.http.get(this.api + 'controlconstruct/list/by-question/' + id).toPromise();
  }

  getQuestionItems(key: string): Promise<any> {
    return this.http.get(this.api + 'questionitem/page/').toPromise();
  }

  getQuestionItemsRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/questionitem/' + id + '/all').toPromise();
  }

  getConceptsByQuestionitemId(id: string): Promise<any> {
    return this.http.get(this.api + 'concept/list/by-QuestionItem/' + id).toPromise();
  }

  getFile(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'othermaterial/files/' + id, {responseType: 'blob'}).toPromise();
  }
  getPdf(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'controlconstruct/pdf/' + id, { responseType: 'blob'}).toPromise();
  }

  searchControlConstructs(name: string = '%', questionText: string = '%', page: String = '0', sort: string = ''): Promise<any> {
    let query = '&name=' + name + '&questiontext=' + questionText;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'controlconstruct/page/search/?constructkind=QUESTION_CONSTRUCT'
      + '&page=' + page + this.pageSize + query)
      .toPromise();
  }

  searchQuestionItemsByNameAndQuestion(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    let query = name.length > 0 ? '&question=' + '*' + name + '*' + '&name=' + '*' + name + '*' : '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.http.get(this.api + 'questionitem/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  }

  searchInstructions(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api + 'instruction/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  }

  searchUniverses(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api + 'universe/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  }

  create(cc: ControlConstruct): Observable<any> {
    return this.http.post(this.api + 'controlconstruct/create', cc);
  }

  update(cc: ControlConstruct): Observable<any> {
    return this.http.post(this.api + 'controlconstruct/', cc);
  }

  deleteControlConstruct(id: string): Observable<any> {
    return this.http.delete(this.api + 'controlconstruct/delete/' + id);
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api + 'othermaterial/delete/' + id);
  }

  uploadFile(id: string, files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id + '/CC', formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }

}
