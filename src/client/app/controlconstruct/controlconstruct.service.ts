import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { QuestionItem } from '../question/question.service';
// import { HttpClient } from '@angular/common/http';

export class Universe {
  id:string;
  description:string;
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
export class ControlConstructService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/create');
  }

  getControlConstruct(id: string): any {
    return this.get('controlconstruct/' + id);
  }

  getControlConstructRevision(id: string, rev: string) : any {
    return this.get('audit/controlconstruct/' + id + '/' + rev);
  }

  getFile(id: string): any {
    return this.getBlob('othermaterial/files/'+id);
  }

  uploadFile(id: string, files: any): any {
    return this.uploadBlob(id,files);
  }

  deleteFile(id: string) {
    return this.delete('othermaterial/delete/' + id);
  }

  getPdf(id: string) {
    return this.getBlob('controlconstruct/pdf/'+id);
  }

  update(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/');
  }

  getControlConstructsByQuestionItem(id: string): any {
    return this.get('controlconstruct/list/by-question/' + id);
  }

  getQuestionItems(key: string): any {
    return this.get('questionitem/page');
  }

  getQuestionItemsRevisions(id: string) : any {
    return this.get('audit/questionitem/' + id + '/all');
  }

  deleteControlConstruct(id: string): any {
    return this.delete('controlconstruct/delete/' + id);
  }

  getConceptsByQuestionitemId(id: string) {
    return this.get('concept/list/by-QuestionItem/'+ id);
  }

  searchControlConstructs(name: string = '%', questionText: string ='%', page: String = '0', sort: string = ''): any {
    let query = '&name=' + name + '&questiontext=' + questionText;
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('controlconstruct/page/search?constructkind=QUESTION_CONSTRUCT' + '&page=' + page + this.pageSize + query);
  }

  searchQuestionItemsByNameAndQuestion(name: string = '', page: String = '0', sort: String = ''): any {
    let query = name.length > 0? '&question=' + '*' + name +'*' + '&name=' + '*' + name +'*': '';
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('questionitem/page/search?' + 'page=' + page + this.pageSize + query);
  }

  searchInstructions(description: string = '', page: String = '0'): any {
    let query = description.length > 0? '&description=' + '*' + description +'*': '';
    return this.get('instruction/page/search?' + 'page=' + page + this.pageSize + query);
  }

  searchUniverses(description: string = '', page: String = '0') {
    let query = description.length > 0? '&description=' + '*' + description +'*': '';
    return this.get('universe/page/search?' + 'page=' + page + this.pageSize + query);
  }
}
